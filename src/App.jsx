import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import VideoTable from './components/VideoTable';
import Loading from './components/Loading';
import { searchVideos } from './utils/youtube';
import './App.css';

function App() {
  const [allVideos, setAllVideos] = useState([]); // 검색된 전체 영상
  const [videos, setVideos] = useState([]); // 필터링된 영상
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({
    contentType: 'all',
    minViews: 0,
    minSubscribers: 0
  });

  // 검색 실행
  const handleSearch = async (searchOptions) => {
    setIsLoading(true);
    setError(null);
    setSearchKeyword(searchOptions.keyword);

    try {
      const results = await searchVideos(searchOptions);
      setAllVideos(results);

      // 현재 필터 적용
      applyFilters(results, filters);
    } catch (err) {
      setError(err.message);
      setAllVideos([]);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(allVideos, newFilters);
  };

  // 필터 적용 함수
  const applyFilters = (videoList, currentFilters) => {
    let filteredResults = videoList;

    // 콘텐츠 타입 필터 (3분 = 180초)
    if (currentFilters.contentType === 'shorts') {
      filteredResults = filteredResults.filter(video => video.durationInSeconds < 180);
    } else if (currentFilters.contentType === 'long') {
      filteredResults = filteredResults.filter(video => video.durationInSeconds >= 180);
    }

    // 조회수 필터
    if (currentFilters.minViews > 0) {
      filteredResults = filteredResults.filter(
        video => Number(video.viewCount) >= currentFilters.minViews
      );
    }

    // 구독자 수 필터
    if (currentFilters.minSubscribers > 0) {
      filteredResults = filteredResults.filter(
        video => Number(video.subscriberCount) >= currentFilters.minSubscribers
      );
    }

    setVideos(filteredResults);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <SearchBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />
      </aside>

      <main className="main-content">
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <p className="error-hint">
              .env 파일에서 VITE_YOUTUBE_API_KEY를 확인해주세요.
            </p>
          </div>
        )}

        {isLoading && <Loading />}

        {!isLoading && !error && videos.length > 0 && (
          <VideoTable videos={videos} keyword={searchKeyword} />
        )}

        {!isLoading && !error && videos.length === 0 && searchKeyword && (
          <div className="no-results">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        {!isLoading && !error && videos.length === 0 && !searchKeyword && (
          <div className="welcome-message">
            <h2>📺 TubeRay[센트리언전용]에 오신 것을 환영합니다</h2>
            <p>왼쪽 검색창에서 키워드를 입력하고 옵션을 선택한 후 검색하세요.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
