import React from 'react';
import { formatNumber, formatDate } from '../utils/youtube';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  const handleClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    window.open(`https://www.youtube.com/channel/${video.channelId}`, '_blank');
  };

  return (
    <div className="video-card" onClick={handleClick}>
      <div className="thumbnail-container">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="thumbnail"
        />
        <div className="video-stats-overlay">
          <span className="view-count">👁️ {formatNumber(video.viewCount)}</span>
        </div>
      </div>

      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>

        <div className="channel-info" onClick={handleChannelClick}>
          <span className="channel-name">📺 {video.channelTitle}</span>
          <span className="subscriber-count">
            구독자 {formatNumber(video.subscriberCount)}명
          </span>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">조회수</span>
            <span className="stat-value">{formatNumber(video.viewCount)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">좋아요</span>
            <span className="stat-value">{formatNumber(video.likeCount)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">댓글</span>
            <span className="stat-value">{formatNumber(video.commentCount)}</span>
          </div>
        </div>

        <div className="video-meta">
          <span className="published-date">{formatDate(video.publishedAt)}</span>
          <span className="channel-videos">채널 영상 {formatNumber(video.videoCount)}개</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
