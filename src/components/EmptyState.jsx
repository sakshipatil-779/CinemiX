import React from "react";
import { Film } from "lucide-react";

export default function EmptyState({
  title = "No movies found",
  description = "Try adjusting your search criteria or removing filters to see more results.",
  actionText = "Reset Filters",
  onAction = null,
  icon: Icon = Film
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{description}</p>
      {onAction && (
        <button className="btn-secondary" onClick={onAction} style={{ marginTop: "12px" }}>
          {actionText}
        </button>
      )}
    </div>
  );
}
