"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className={`confirm-overlay${isOpen ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Delete bookmark"
    >
      <div className="confirm-box">
        <div className="confirm-title">{"// delete bookmark?"}</div>
        <div className="confirm-sub">This action cannot be undone.</div>
        <div className="confirm-btns">
          <button className="btn btn-ghost" onClick={onCancel}>
            cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            → delete
          </button>
        </div>
      </div>
    </div>
  );
}
