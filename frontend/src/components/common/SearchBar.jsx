import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useDebounce from '../../hooks/useDebounce';

export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 500);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    axiosInstance
      .get(`/cars?keyword=${encodeURIComponent(debouncedKeyword)}`)
      .then((res) => {
        const data = res.data?.content ?? res.data ?? [];
        setResults(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      })
      .catch(() => {
        setResults([]);
        setShowDropdown(true);
      })
      .finally(() => setLoading(false));
  }, [debouncedKeyword]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (car) => {
    setKeyword('');
    setShowDropdown(false);
    navigate(`/cars/${car.id}`);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <input
        style={styles.input}
        type="text"
        placeholder="Tìm kiếm xe..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => debouncedKeyword.trim() && setShowDropdown(true)}
      />
      {loading && <span style={styles.spinner}>⏳</span>}

      {showDropdown && (
        <div style={styles.dropdown}>
          {results.length === 0 ? (
            <div style={styles.noResult}>Không tìm thấy xe phù hợp với từ khóa</div>
          ) : (
            results.map((car) => (
              <div
                key={car.id}
                style={styles.item}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f4f8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                onClick={() => handleSelect(car)}
              >
                <span style={styles.carName}>{car.name}</span>
                {car.price && (
                  <span style={styles.carPrice}>
                    {Number(car.price).toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '280px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  spinner: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '12px',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 1000,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  noResult: {
    padding: '12px 16px',
    color: '#888',
    fontSize: '13px',
    textAlign: 'center',
  },
  item: {
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    transition: 'background-color 0.15s',
  },
  carName: {
    fontSize: '14px',
    color: '#1a3a5c',
    fontWeight: '500',
  },
  carPrice: {
    fontSize: '12px',
    color: '#666',
  },
};
