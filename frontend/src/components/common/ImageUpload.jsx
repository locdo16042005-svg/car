import { useState, useRef, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '12px' },
  dropZone: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'border-color 0.2s, background-color 0.2s',
  },
  dropZoneActive: { borderColor: '#4a90e2', backgroundColor: '#f0f7ff' },
  dropZoneDisabled: { cursor: 'not-allowed', opacity: 0.6 },
  hiddenInput: { display: 'none' },
  hint: { fontSize: '13px', color: '#888', marginTop: '4px' },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '8px',
  },
  previewItem: { position: 'relative', borderRadius: '6px', overflow: 'hidden' },
  previewImg: { width: '100%', height: '100px', objectFit: 'cover', display: 'block' },
  removeBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: 'rgba(0,0,0,0.55)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: '22px',
    textAlign: 'center',
    padding: 0,
  },
  existingBadge: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    background: 'rgba(0,0,0,0.45)',
    color: '#fff',
    fontSize: '10px',
    padding: '1px 5px',
    borderRadius: '3px',
  },
  uploadBtn: {
    padding: '8px 20px',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    alignSelf: 'flex-start',
  },
  uploadBtnDisabled: { backgroundColor: '#a0c4f1', cursor: 'not-allowed' },
  progressBar: {
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#4a90e2', transition: 'width 0.3s' },
  error: { color: '#d32f2f', fontSize: '13px', padding: '6px 10px', background: '#fdecea', borderRadius: '4px' },
  counter: { fontSize: '13px', color: '#666' },
};

export default function ImageUpload({
  onUploadComplete,
  maxFiles = 10,
  existingUrls = [],
}) {
  const [existingList, setExistingList] = useState(existingUrls);
  const [newFiles, setNewFiles] = useState([]); // { file, previewUrl }
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const totalCount = existingList.length + newFiles.length;
  const remaining = maxFiles - totalCount;

  const validateFiles = useCallback(
    (files) => {
      const errors = [];
      const valid = [];

      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          errors.push(`"${file.name}" không đúng định dạng (chỉ JPEG, PNG, WebP).`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`"${file.name}" vượt quá 5MB.`);
          continue;
        }
        valid.push(file);
      }

      return { valid, errors };
    },
    []
  );

  const addFiles = useCallback(
    (fileList) => {
      setError('');
      const files = Array.from(fileList);

      if (files.length > remaining) {
        setError(`Chỉ có thể thêm tối đa ${remaining} ảnh nữa (giới hạn ${maxFiles} ảnh).`);
        return;
      }

      const { valid, errors } = validateFiles(files);

      if (errors.length) {
        setError(errors.join(' '));
        return;
      }

      const previews = valid.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setNewFiles((prev) => [...prev, ...previews]);
    },
    [remaining, maxFiles, validateFiles]
  );

  const handleInputChange = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeNew = (index) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExisting = (index) => {
    setExistingList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!newFiles.length) return;
    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const formData = new FormData();
      newFiles.forEach(({ file }) => formData.append('files', file));

      const response = await axiosInstance.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      const uploadedUrls = Array.isArray(response.data) ? response.data : (response.data?.urls ?? []);
      const allUrls = [...existingList, ...uploadedUrls];

      // Revoke object URLs
      newFiles.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
      setNewFiles([]);
      setExistingList(allUrls);
      setProgress(100);

      if (onUploadComplete) onUploadComplete(allUrls);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const dropZoneStyle = {
    ...styles.dropZone,
    ...(dragOver ? styles.dropZoneActive : {}),
    ...(remaining === 0 ? styles.dropZoneDisabled : {}),
  };

  return (
    <div style={styles.container}>
      {/* Drop zone */}
      <div
        style={dropZoneStyle}
        onClick={() => remaining > 0 && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={remaining > 0 ? handleDrop : undefined}
      >
        <div>📷 Kéo thả ảnh vào đây hoặc <span style={{ color: '#4a90e2', textDecoration: 'underline' }}>chọn file</span></div>
        <div style={styles.hint}>JPEG, PNG, WebP · Tối đa 5MB/ảnh</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={styles.hiddenInput}
          onChange={handleInputChange}
          disabled={remaining === 0}
        />
      </div>

      {/* Counter */}
      <div style={styles.counter}>
        {totalCount}/{maxFiles} ảnh
      </div>

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Preview grid */}
      {(existingList.length > 0 || newFiles.length > 0) && (
        <div style={styles.previewGrid}>
          {existingList.map((url, i) => (
            <div key={`existing-${i}`} style={styles.previewItem}>
              <img src={url} alt={`Ảnh ${i + 1}`} style={styles.previewImg} />
              <span style={styles.existingBadge}>Đã lưu</span>
              <button
                style={styles.removeBtn}
                onClick={() => removeExisting(i)}
                title="Xóa ảnh"
                disabled={uploading}
              >
                ×
              </button>
            </div>
          ))}
          {newFiles.map(({ previewUrl }, i) => (
            <div key={`new-${i}`} style={styles.previewItem}>
              <img src={previewUrl} alt={`Ảnh mới ${i + 1}`} style={styles.previewImg} />
              <button
                style={styles.removeBtn}
                onClick={() => removeNew(i)}
                title="Xóa ảnh"
                disabled={uploading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      )}

      {/* Upload button */}
      {newFiles.length > 0 && (
        <button
          style={{ ...styles.uploadBtn, ...(uploading ? styles.uploadBtnDisabled : {}) }}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? `Đang upload... ${progress}%` : `Upload ${newFiles.length} ảnh`}
        </button>
      )}
    </div>
  );
}
