import React from 'react';
import VideoCard from './VideoCard';
import './VideoList.css';

const VideoList = ({ videos, keyword }) => {
  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="video-list-container">
      <div className="search-results-header">
        <h2>"{keyword}" 검색 결과</h2>
        <span className="results-count">{videos.length}개의 영상</span>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
