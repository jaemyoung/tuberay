import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * 기간을 ISO 8601 날짜로 변환
 * @param {string} period - 기간 ('hour', 'today', 'week', 'month', 'year', 'all')
 * @returns {string|null} ISO 8601 날짜 문자열 또는 null
 */
const getPeriodDate = (period) => {
  const now = new Date();

  switch (period) {
    case 'hour':
      return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    case 'today':
      return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null;
  }
};

/**
 * 키워드로 YouTube 영상 검색
 * @param {Object} options - 검색 옵션
 * @param {string} options.keyword - 검색 키워드
 * @param {number} options.maxResults - 최대 결과 수 (기본값: 10)
 * @param {string} options.period - 기간 필터 ('all', 'hour', 'today', 'week', 'month', 'year')
 * @param {string} options.region - 국가 코드 (예: 'KR', 'US', 'JP')
 * @returns {Promise<Array>} 검색 결과 배열
 */
export const searchVideos = async ({ keyword, maxResults = 10, period = 'all', region = '' }) => {
  try {
    const allVideos = [];
    let pageToken = null;
    const perPage = 50; // YouTube API 최대값

    // 100개를 가져오려면 pagination 필요
    const totalPages = Math.ceil(maxResults / perPage);

    for (let page = 0; page < totalPages; page++) {
      const resultsToFetch = Math.min(perPage, maxResults - allVideos.length);

      const params = {
        part: 'snippet',
        q: keyword,
        key: API_KEY,
        type: 'video',
        maxResults: resultsToFetch,
        order: 'relevance'
      };

      // 기간 필터 추가
      const publishedAfter = getPeriodDate(period);
      if (publishedAfter) {
        params.publishedAfter = publishedAfter;
      }

      // 국가 필터 추가
      if (region) {
        params.regionCode = region;
      }

      // 페이지 토큰 추가
      if (pageToken) {
        params.pageToken = pageToken;
      }

      const response = await axios.get(`${BASE_URL}/search`, { params });
      const videos = response.data.items;

      if (videos.length === 0) break;

      allVideos.push(...videos);
      pageToken = response.data.nextPageToken;

      // 더 이상 페이지가 없거나 원하는 수량에 도달하면 종료
      if (!pageToken || allVideos.length >= maxResults) break;
    }

    // 각 영상의 상세 정보 가져오기 (조회수, 채널 구독자 수)
    const enrichedVideos = await Promise.all(
      allVideos.map(async (video) => {
        const videoId = video.id.videoId;
        const channelId = video.snippet.channelId;

        // 영상 통계 정보 가져오기 (조회수, 좋아요 수, 영상 길이 등)
        const videoStats = await getVideoStatistics(videoId);

        // 채널 정보 가져오기 (구독자 수, 채널 전체 조회수)
        const channelStats = await getChannelStatistics(channelId);

        // 영상 길이를 초 단위로 변환
        const durationInSeconds = parseDuration(videoStats.duration || 'PT0S');

        // 채널 기여도 계산 (영상 조회수 / 채널 전체 조회수 * 100)
        const channelViewCount = Number(channelStats.viewCount) || 1;
        const videoViewCount = Number(videoStats.viewCount) || 0;
        const channelContribution = channelViewCount > 0
          ? (videoViewCount / channelViewCount * 100).toFixed(2)
          : 0;

        // 성과배율 계산 (조회수 / 구독자 수)
        const subscriberCount = Number(channelStats.subscriberCount) || 1;
        const performanceMultiplier = subscriberCount > 0
          ? (videoViewCount / subscriberCount).toFixed(2)
          : 0;

        return {
          id: videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium.url,
          channelTitle: video.snippet.channelTitle,
          channelId: channelId,
          publishedAt: video.snippet.publishedAt,
          viewCount: videoStats.viewCount || 0,
          likeCount: videoStats.likeCount || 0,
          commentCount: videoStats.commentCount || 0,
          subscriberCount: channelStats.subscriberCount || 0,
          videoCount: channelStats.videoCount || 0,
          channelViewCount: channelStats.viewCount || 0,
          channelContribution: Number(channelContribution),
          performanceMultiplier: Number(performanceMultiplier),
          duration: videoStats.duration || 'PT0S',
          durationInSeconds: durationInSeconds
        };
      })
    );

    return enrichedVideos;
  } catch (error) {
    console.error('YouTube API 검색 오류:', error);
    throw new Error('영상 검색에 실패했습니다. API 키를 확인해주세요.');
  }
};

/**
 * 영상 통계 정보 가져오기 (조회수, 좋아요 수, 영상 길이 등)
 * @param {string} videoId - 영상 ID
 * @returns {Promise<Object>} 영상 통계 정보
 */
const getVideoStatistics = async (videoId) => {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'statistics,contentDetails',
        id: videoId,
        key: API_KEY
      }
    });

    const video = response.data.items[0];
    return {
      ...video?.statistics || {},
      duration: video?.contentDetails?.duration || 'PT0S'
    };
  } catch (error) {
    console.error('영상 통계 조회 오류:', error);
    return {};
  }
};

/**
 * 채널 통계 정보 가져오기 (구독자 수, 영상 수)
 * @param {string} channelId - 채널 ID
 * @returns {Promise<Object>} 채널 통계 정보
 */
const getChannelStatistics = async (channelId) => {
  try {
    const response = await axios.get(`${BASE_URL}/channels`, {
      params: {
        part: 'statistics',
        id: channelId,
        key: API_KEY
      }
    });

    return response.data.items[0]?.statistics || {};
  } catch (error) {
    console.error('채널 통계 조회 오류:', error);
    return {};
  }
};

/**
 * 숫자를 한국어 단위로 포맷팅 (만, 억)
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatNumber = (num) => {
  const number = parseInt(num);

  if (number >= 100000000) {
    return `${(number / 100000000).toFixed(1)}억`;
  } else if (number >= 10000) {
    return `${(number / 10000).toFixed(1)}만`;
  } else if (number >= 1000) {
    return number.toLocaleString();
  }

  return number.toString();
};

/**
 * ISO 8601 날짜를 한국 시간 형식으로 변환
 * @param {string} isoDate - ISO 날짜 문자열
 * @returns {string} 포맷팅된 날짜
 */
export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}주 전`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}개월 전`;
  } else {
    return `${Math.floor(diffDays / 365)}년 전`;
  }
};

/**
 * ISO 8601 duration을 초 단위로 변환
 * @param {string} duration - ISO 8601 duration (예: PT1H30M45S)
 * @returns {number} 초 단위 시간
 */
export const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * 초를 시:분:초 형식으로 변환
 * @param {number} totalSeconds - 총 초
 * @returns {string} 포맷팅된 시간 (예: 1:30:45 또는 5:30)
 */
export const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
};
