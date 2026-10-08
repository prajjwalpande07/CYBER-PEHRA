import networkx as nx
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.mule import MuleNode, MuleEdge

def build_networkx_graph(nodes: List[MuleNode], edges: List[MuleEdge]) -> nx.DiGraph:
    G = nx.DiGraph()
    for n in nodes:
        G.add_node(
            n.id,
            label=n.label,
            node_type=n.type,
            bank=n.bank,
            account_number=n.account_number,
            holder=n.holder,
            balance=n.balance,
            risk_score=n.risk_score,
            flag=n.flag,
            x=n.x,
            y=n.y,
        )
    for e in edges:
        G.add_edge(
            e.source,
            e.target,
            id=e.id,
            amount=e.amount,
            edge_type=e.type,
            timestamp=e.timestamp,
            hop_level=e.hop_level,
        )
    return G

def get_full_mule_network(db: Session) -> Dict[str, Any]:
    nodes = db.query(MuleNode).all()
    edges = db.query(MuleEdge).all()
    return {
        "nodes": nodes,
        "edges": edges,
    }

def get_account_subgraph(db: Session, account_id: str) -> Dict[str, Any]:
    nodes = db.query(MuleNode).all()
    edges = db.query(MuleEdge).all()
    G = build_networkx_graph(nodes, edges)

    # Search for target node by id or account_number
    target_node_id = None
    for n in nodes:
        if n.id == account_id or account_id in n.account_number:
            target_node_id = n.id
            break

    if not target_node_id or not G.has_node(target_node_id):
        return {"nodes": nodes, "edges": edges}

    # Extract 2-hop ego network
    subgraph_nodes = set([target_node_id])
    # In-edges (predecessors)
    for pred in G.predecessors(target_node_id):
        subgraph_nodes.add(pred)
        for pred2 in G.predecessors(pred):
            subgraph_nodes.add(pred2)
    # Out-edges (successors)
    for succ in G.successors(target_node_id):
        subgraph_nodes.add(succ)
        for succ2 in G.successors(succ):
            subgraph_nodes.add(succ2)

    filtered_nodes = [n for n in nodes if n.id in subgraph_nodes]
    filtered_edges = [
        e for e in edges
        if e.source in subgraph_nodes and e.target in subgraph_nodes
    ]

    return {
        "nodes": filtered_nodes,
        "edges": filtered_edges,
    }
