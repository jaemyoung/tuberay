import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onFilterChange, isLoading }) => {
  const [keyword, setKeyword] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [period, setPeriod] = useState('all');
  const [region, setRegion] = useState('KR');
  const [contentType, setContentType] = useState('all');
  const [minViews, setMinViews] = useState(0);
  const [minSubscribers, setMinSubscribers] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch({
        keyword,
        maxResults,
        period,
        region
      });
    }
  };

  const handleFilterChange = (filterType, value) => {
    // 새로운 필터 값 계산
    const newContentType = filterType === 'contentType' ? value : contentType;
    const newMinViews = filterType === 'minViews' ? Number(value) : minViews;
    const newMinSubscribers = filterType === 'minSubscribers' ? Number(value) : minSubscribers;

    // 상태 업데이트
    if (filterType === 'contentType') {
      setContentType(value);
    } else if (filterType === 'minViews') {
      setMinViews(Number(value));
    } else if (filterType === 'minSubscribers') {
      setMinSubscribers(Number(value));
    }

    // 새로운 값으로 필터 적용
    onFilterChange({
      contentType: newContentType,
      minViews: newMinViews,
      minSubscribers: newMinSubscribers
    });
  };

  return (
    <div className="search-bar-container">
      <h1 className="title">📺 TubeRay</h1>
      <p className="subtitle">YouTube 영상 검색 및 분석 도구[센트리언 전용]</p>

      {/* 검색 섹션 */}
      <div className="section-header">🔍 검색</div>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색할 키워드를 입력하세요..."
            className="search-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || !keyword.trim()}
          >
            {isLoading ? '검색 중...' : '🔍 검색'}
          </button>
        </div>

        <div className="search-options-horizontal">
          <div className="option-group-inline">
            <label htmlFor="maxResults">수집 영상수</label>
            <select
              id="maxResults"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              disabled={isLoading}
              className="option-select-inline"
            >
              <option value={10}>10개</option>
              <option value={50}>50개</option>
              <option value={100}>100개</option>
              <option value={200}>200개</option>
              <option value={300}>300개</option>
              <option value={500}>500개</option>
            </select>
          </div>

          <div className="option-group-inline">
            <label htmlFor="period">기간</label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              disabled={isLoading}
              className="option-select-inline"
            >
              <option value="all">전체</option>
              <option value="hour">1시간 이내</option>
              <option value="today">오늘</option>
              <option value="week">이번 주</option>
              <option value="month">이번 달</option>
              <option value="year">올해</option>
            </select>
          </div>

          <div className="option-group-inline">
            <label htmlFor="region">국가</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={isLoading}
              className="option-select-inline"
            >
              <option value="KR">한국</option>
              <option value="US">미국</option>
              <option value="JP">일본</option>
              <option value="GB">영국</option>
              <option value="">전 세계</option>
            </select>
          </div>
        </div>
      </form>

      {/* 필터 섹션 */}
      <div className="filter-section">
        <div className="section-header">🎯 필터</div>
        <div className="filter-options-horizontal">
          <div className="option-group-inline">
            <label htmlFor="contentType">콘텐츠 타입</label>
            <select
              id="contentType"
              value={contentType}
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
              className="option-select-inline"
            >
              <option value="all">전체</option>
              <option value="shorts">쇼츠</option>
              <option value="long">롱폼</option>
            </select>
          </div>

          <div className="option-group-inline">
            <label htmlFor="minViews">조회수</label>
            <select
              id="minViews"
              value={minViews}
              onChange={(e) => handleFilterChange('minViews', e.target.value)}
              className="option-select-inline"
            >
              <option value={0}>선택안함</option>
              <option value={10000}>1만 이상</option>
              <option value={50000}>5만 이상</option>
              <option value={100000}>10만 이상</option>
              <option value={200000}>20만 이상</option>
              <option value={500000}>50만 이상</option>
              <option value={1000000}>100만 이상</option>
            </select>
          </div>

          <div className="option-group-inline">
            <label htmlFor="minSubscribers">구독자 수</label>
            <select
              id="minSubscribers"
              value={minSubscribers}
              onChange={(e) => handleFilterChange('minSubscribers', e.target.value)}
              className="option-select-inline"
            >
              <option value={0}>선택안함</option>
              <option value={100}>100명 이상</option>
              <option value={1000}>1000명 이상</option>
              <option value={5000}>5000명 이상</option>
              <option value={10000}>1만명 이상</option>
              <option value={50000}>5만명 이상</option>
              <option value={100000}>10만명 이상</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
