"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MediaStrip, type MediaItem } from "@/components/tools/MediaStrip";
import { formatBytes } from "@/lib/files";

export function DownloadConfirm({
  open,
  filename,
  bytes,
  count = 1,
  detail,
  previews,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  filename: string;
  bytes?: number;
  count?: number;
  detail?: string;
  previews: MediaItem[];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={count > 1 ? "Download these files?" : "Download this file?"}
    >
      <p className="text-sm text-muted">
        Check the preview first. Nothing leaves this tab until you confirm.
      </p>
      <p className="mt-3 font-mono text-sm text-ink break-all">{filename}</p>
      {bytes != null ? (
        <p className="mt-1 text-xs text-muted">{formatBytes(bytes)}</p>
      ) : null}
      {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
      <div className="mt-4">
        <MediaStrip items={previews} empty="No preview." />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="primary" onClick={onConfirm}>
          {count > 1 ? `Download ${count} files` : "Download"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
