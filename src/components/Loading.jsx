import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">YouTube 영상을 검색하고 있습니다...</p>
      <p className="loading-subtext">영상 정보와 채널 통계를 불러오는 중입니다.</p>
    </div>
  );
};

export default Loading;
