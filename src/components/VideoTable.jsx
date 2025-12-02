import React, { useState } from 'react';
import { formatNumber, formatDate, formatDuration } from '../utils/youtube';
import './VideoTable.css';

const VideoTable = ({ videos, keyword }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      // 같은 열을 클릭한 경우
      if (prevConfig.key === key) {
        // desc -> asc -> none -> desc 순환
        if (prevConfig.direction === 'desc') {
          return { key, direction: 'asc' };
        } else if (prevConfig.direction === 'asc') {
          return { key: null, direction: null }; // 정렬 해제
        }
      }
      // 새로운 열을 클릭하거나 정렬 해제 상태에서 클릭
      return { key, direction: 'desc' };
    });
  };

  const getSortedVideos = () => {
    if (!sortConfig.key || !sortConfig.direction) {
      return videos;
    }

    return [...videos].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // 숫자 필드들
      const numericFields = [
        'viewCount', 'likeCount', 'commentCount', 'subscriberCount',
        'channelContribution', 'performanceMultiplier', 'durationInSeconds'
      ];

      // 날짜 필드 (publishedAt)
      if (sortConfig.key === 'publishedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
        const comparison = bValue - aValue; // 내림차순 기준
        return sortConfig.direction === 'desc' ? comparison : -comparison;
      }

      // 숫자 필드
      if (numericFields.includes(sortConfig.key)) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
        const comparison = bValue - aValue; // 내림차순 기준
        return sortConfig.direction === 'desc' ? comparison : -comparison;
      }

      // 문자열 필드 (title, channelTitle)
      aValue = String(aValue);
      bValue = String(bValue);
      const comparison = bValue.localeCompare(aValue, 'ko-KR'); // 내림차순 기준
      return sortConfig.direction === 'desc' ? comparison : -comparison;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key || !sortConfig.direction) {
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
              <th className="th-thumbnail" data-tooltip="영상의 미리보기 이미지">썸네일</th>
              <th
                className="th-title sortable"
                onClick={() => handleSort('title')}
                data-tooltip="영상의 제목 (클릭하여 정렬)"
              >
                제목 {getSortIcon('title')}
              </th>
              <th
                className="th-channel sortable"
                onClick={() => handleSort('channelTitle')}
                data-tooltip="영상을 업로드한 채널명 (클릭하여 정렬)"
              >
                채널 {getSortIcon('channelTitle')}
              </th>
              <th
                className="th-duration sortable"
                onClick={() => handleSort('durationInSeconds')}
                data-tooltip="영상의 재생 시간 (쇼츠: 3분 미만, 롱폼: 3분 이상)"
              >
                영상 길이 {getSortIcon('durationInSeconds')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('subscriberCount')}
                data-tooltip="채널의 구독자 수 (클릭하여 정렬)"
              >
                구독자 {getSortIcon('subscriberCount')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('viewCount')}
                data-tooltip="영상의 조회수 (클릭하여 정렬)"
              >
                조회수 {getSortIcon('viewCount')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('likeCount')}
                data-tooltip="영상의 좋아요 수 (클릭하여 정렬)"
              >
                좋아요 {getSortIcon('likeCount')}
              </th>
              <th
                className="th-number sortable"
                onClick={() => handleSort('commentCount')}
                data-tooltip="영상의 댓글 수 (클릭하여 정렬)"
              >
                댓글 {getSortIcon('commentCount')}
              </th>
              <th
                className="th-percent sortable"
                onClick={() => handleSort('channelContribution')}
                data-tooltip="해당 영상이 채널 전체 조회수에서 차지하는 비율 (%)"
              >
                채널 기여도 {getSortIcon('channelContribution')}
              </th>
              <th
                className="th-multiplier sortable"
                onClick={() => handleSort('performanceMultiplier')}
                data-tooltip="구독자 대비 조회수 비율 (조회수 ÷ 구독자 수)"
              >
                성과배율 {getSortIcon('performanceMultiplier')}
              </th>
              <th
                className="th-date sortable"
                onClick={() => handleSort('publishedAt')}
                data-tooltip="영상이 게시된 날짜 (클릭하여 정렬)"
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
