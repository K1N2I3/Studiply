import { useState, useEffect } from 'react';

const useFocusTest = () => {
  const [showFocusTest, setShowFocusTest] = useState(false);
  const [testSubject, setTestSubject] = useState('Italian');
  const [lastTestTime, setLastTestTime] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // 社交媒体网站列表
  const socialMediaSites = [
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'tiktok.com',
    'youtube.com',
    'snapchat.com',
    'linkedin.com',
    'reddit.com',
    'pinterest.com',
    'discord.com'
  ];

  // 检查当前网站是否为社交媒体
  const isSocialMediaSite = (url) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return socialMediaSites.some(site => hostname.includes(site));
    } catch {
      return false;
    }
  };

  // 检查是否需要显示专注测试
  const shouldShowFocusTest = () => {
    // 如果已经显示过测试，不重复显示
    if (showFocusTest) return false;
    
    // 检查是否在社交媒体网站
    if (typeof window !== 'undefined' && isSocialMediaSite(window.location.href)) {
      // 检查上次测试时间，如果超过1小时才显示新测试
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if (!lastTestTime || (now - lastTestTime) > oneHour) {
        return true;
      }
    }
    
    return false;
  };

  // 监听页面变化
  useEffect(() => {
    const handlePageChange = () => {
      if (shouldShowFocusTest()) {
        setShowFocusTest(true);
        // 随机选择一个测试主题
        const subjects = ['Italian', 'Mathematics', 'Philosophy', 'Biology'];
        setTestSubject(subjects[Math.floor(Math.random() * subjects.length)]);
      }
    };

    // 初始检查
    handlePageChange();

    // 监听URL变化（用于SPA）
    const handlePopState = () => {
      setTimeout(handlePageChange, 100);
    };

    window.addEventListener('popstate', handlePopState);
    
    // 定期检查（用于检测程序化导航）
    const interval = setInterval(handlePageChange, 2000);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearInterval(interval);
    };
  }, [lastTestTime, showFocusTest]);

  // 处理测试完成
  const handleTestComplete = (score, totalQuestions) => {
    const result = {
      score,
      totalQuestions,
      subject: testSubject,
      timestamp: new Date().toISOString(),
      percentage: Math.round((score / totalQuestions) * 100)
    };
    
    setTestResults(prev => [...prev.slice(-9), result]); // 保留最近10次结果
    setLastTestTime(Date.now());
    setShowFocusTest(false);
    
    // 保存到localStorage
    localStorage.setItem('focusTestResults', JSON.stringify([...testResults.slice(-9), result]));
    localStorage.setItem('lastFocusTestTime', Date.now().toString());
  };

  // 关闭测试
  const closeFocusTest = () => {
    setShowFocusTest(false);
  };

  // 手动触发测试
  const triggerFocusTest = (subject = 'Italian') => {
    setTestSubject(subject);
    setShowFocusTest(true);
  };

  // 获取测试统计
  const getTestStats = () => {
    if (testResults.length === 0) return null;
    
    const totalTests = testResults.length;
    const averageScore = testResults.reduce((sum, result) => sum + result.percentage, 0) / totalTests;
    const bestScore = Math.max(...testResults.map(result => result.percentage));
    const recentTests = testResults.slice(-5);
    const recentAverage = recentTests.reduce((sum, result) => sum + result.percentage, 0) / recentTests.length;
    
    return {
      totalTests,
      averageScore: Math.round(averageScore),
      bestScore,
      recentAverage: Math.round(recentAverage),
      lastTest: testResults[testResults.length - 1]
    };
  };

  // 从localStorage加载数据
  useEffect(() => {
    const savedResults = localStorage.getItem('focusTestResults');
    const savedTime = localStorage.getItem('lastFocusTestTime');
    
    if (savedResults) {
      setTestResults(JSON.parse(savedResults));
    }
    
    if (savedTime) {
      setLastTestTime(parseInt(savedTime));
    }
  }, []);

  return {
    showFocusTest,
    testSubject,
    testResults,
    handleTestComplete,
    closeFocusTest,
    triggerFocusTest,
    getTestStats,
    isSocialMediaSite
  };
};

export default useFocusTest;
