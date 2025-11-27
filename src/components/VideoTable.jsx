import React, { useState } from 'react';
import { formatNumber, formatDate, formatDuration } from '../utils/youtube';
import './VideoTable.css';

const VideoTable = ({ videos, keyword }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'desc';

    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }

    setSortConfig({ key, direction });
  };

  const getSortedVideos = () => {
    if (!sortConfig.key) {
      return videos;
    }

    const sorted = [...videos].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // 숫자 비교
      if (typeof aValue === 'number' || typeof aValue === 'string') {
        const aNum = Number(aValue);
        const bNum = Number(bValue);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'desc' ? bNum - aNum : aNum - bNum;
        }
      }

      // 문자열 비교
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'desc'
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      return 0;
    });

    return sorted;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return '⇅';
    }
    return sortConfig.direction === 'desc' ? '▼' : '▲';
  };

  const sortedVideos = getSortedVideos();

  const handleVideoClick = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const handleChannelClick = (e, channelId) => {
    e.stopPropagation();
    window.open(`https://www.youtube.com/channel/${channelId}`, '_blank');
  };

  return (
    <div className="video-table-container">
      <div className="table-header">
        <h2>"{keyword}" 검색 결과</h2>
        <span className="results-count">{videos.length}개의 영상</span>
      </div>

      <div className="table-wrapper">
        <table className="video-table">
          <thead>
            <tr>
              <th className="th-thumbnail">썸네일</th>
              <th
                className="th-title sortable"
                onClick={() => handleSort('title')}
              >
                제목 {getSortIcon('title')}
              </th>
              <th
                className="th-channel sortable"
                onClick={() => handleSort('channelTitle')}
              >
                채널 {getSortIcon('channelTitle')}
              </th>
              <th
                className="th-duration sortable"
                onClick={() => handleSort('durationInSeconds')}
              >
                영상 길이 {getSortIcon('durationInSeconds')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('subscriberCount')}
              >
                구독자 {getSortIcon('subscriberCount')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('viewCount')}
              >
                조회수 {getSortIcon('viewCount')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('likeCount')}
              >
                좋아요 {getSortIcon('likeCount')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('commentCount')}
              >
                댓글 {getSortIcon('commentCount')}
              </th>
              <th
                className="th-percent sortable"
                onClick={() => handleSort('channelContribution')}
              >
                채널 기여도 {getSortIcon('channelContribution')}
              </th>
              <th
                className="th-multiplier sortable"
                onClick={() => handleSort('performanceMultiplier')}
              >
                성과배율 {getSortIcon('performanceMultiplier')}
              </th>
              <th
                className="th-date sortable"
                onClick={() => handleSort('publishedAt')}
              >
                게시일 {getSortIcon('publishedAt')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedVideos.map((video) => (
              <tr
                key={video.id}
                className="video-row"
                onClick={() => handleVideoClick(video.id)}
              >
                <td className="td-thumbnail">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="thumbnail-img"
                  />
                </td>
                <td className="td-title">
                  <div className="title-text">{video.title}</div>
                </td>
                <td className="td-channel">
                  <div
                    className="channel-link"
                    onClick={(e) => handleChannelClick(e, video.channelId)}
                  >
                    {video.channelTitle}
                  </div>
                </td>
                <td className="td-duration">
                  <div className={`duration-badge ${video.durationInSeconds < 180 ? 'shorts' : 'long'}`}>
                    {formatDuration(video.durationInSeconds)}
                  </div>
                </td>
                <td className="td-number">{formatNumber(video.subscriberCount)}</td>
                <td className="td-number">{formatNumber(video.viewCount)}</td>
                <td className="td-number">{formatNumber(video.likeCount)}</td>
                <td className="td-number">{formatNumber(video.commentCount)}</td>
                <td className="td-percent">
                  <div className="contribution-bar-container">
                    <div
                      className="contribution-bar"
                      style={{ width: `${Math.min(video.channelContribution, 100)}%` }}
                    ></div>
                    <span className="contribution-text">{video.channelContribution}%</span>
                  </div>
                </td>
                <td className="td-multiplier">
                  <div className="multiplier-badge">
                    <span className="multiplier-value">{video.performanceMultiplier}x</span>
                  </div>
                </td>
                <td className="td-date">{formatDate(video.publishedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoTable;
