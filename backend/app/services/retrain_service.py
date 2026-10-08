from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.feedback import OfficerFeedbackRecord
from app.models.model_meta import ModelMetrics
from app.ml.model_pipeline import ml_pipeline
from app.services.audit_service import append_block

def execute_model_retraining(db: Session):
    # Fetch unused feedback records
    unused_feedbacks = (
        db.query(OfficerFeedbackRecord)
        .filter(OfficerFeedbackRecord.used_in_model_training == False)
        .all()
    )

    feedback_dicts = [
        {
            "outcome": fb.outcome,
            "prediction_accuracy": fb.prediction_accuracy,
            "risk_score_validated": fb.risk_score_validated,
        }
        for fb in unused_feedbacks
    ]

    current_model = db.query(ModelMetrics).filter(ModelMetrics.is_current == True).first()
    prev_version = current_model.version if current_model else "v2.4.1"

    # Retrain pipeline
    result = ml_pipeline.retrain_with_feedback(feedback_dicts)
    new_version = result["version"]
    m = result["metrics"]

    # Mark feedback records as used
    for fb in unused_feedbacks:
        fb.used_in_model_training = True

    # Mark old model as not current
    if current_model:
        current_model.is_current = False

    # Create new model metric record
    now_iso = datetime.now(timezone.utc).isoformat()
    new_model_record = ModelMetrics(
        version=new_version,
        accuracy=m["accuracy"],
        precision=m["precision"],
        recall=m["recall"],
        f1_score=m["f1_score"],
        false_positive_rate=m["false_positive_rate"],
        predictions_today=0,
        successful_predictions=(current_model.successful_predictions if current_model else 312) + len(unused_feedbacks),
        last_retrained=now_iso,
        training_samples=m["training_samples"],
        status="OPTIMAL",
        is_current=True,
    )
    db.add(new_model_record)
    db.commit()
    db.refresh(new_model_record)

    append_block(
        db=db,
        action="MODEL_WEIGHTS_UPDATED",
        officer="CONTINUOUS_LEARNING_PIPELINE",
        case_id=new_version,
        payload_summary=(
            f"Active model upgraded to {new_version}. Ingested {len(unused_feedbacks)} officer ground-truth labels. "
            f"Accuracy: {m['accuracy']}%, Precision: {m['precision']}%, Recall: {m['recall']}%. Merkle proof anchored."
        )
    )

    return {
        "status": "SUCCESS",
        "previous_version": prev_version,
        "new_version": new_version,
        "metrics": new_model_record,
        "feedback_samples_ingested": len(unused_feedbacks),
        "message": f"Autonomous closed-loop retraining complete. Model {new_version} activated in production.",
    }
