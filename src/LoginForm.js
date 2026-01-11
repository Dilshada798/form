import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { searchGitHubUsers, searchGitHubRepos, getGitHubUserDetails } from './githubAuth';

function LoginForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('users'); // 'users' or 'repos'
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (isSignUp && formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = 'Invalid email address';
    }
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required';
    }

    if (isSignUp) {
      if (formData.confirmPassword.trim() === '') {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }
    const userData = {
      email: formData.email,
      name: isSignUp ? formData.name : formData.email.split('@')[0],
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setLoginError('');
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setLoginError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSearch = async (e, page = 1) => {
    if (e) {
      e.preventDefault();
    }
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setSelectedUser(null);
    setCurrentPage(page);

    try {
      if (searchType === 'users') {
        const results = await searchGitHubUsers(searchQuery, page, perPage);
        setSearchResults(results);
      } else {
        const results = await searchGitHubRepos(searchQuery, page, perPage);
        setSearchResults(results);
      }
    } catch (error) {
      setLoginError('Failed to search. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= getTotalPages()) {
      handleSearch(null, newPage);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getTotalPages = () => {
    if (!searchResults) return 0;
    return Math.ceil(searchResults.total_count / perPage);
  };

  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const current = currentPage;
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (current > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < totalPages - 2) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleUserClick = async (username) => {
    setIsSearching(true);
    try {
      const userDetails = await getGitHubUserDetails(username);
      setSelectedUser(userDetails);
    } catch (error) {
      setLoginError('Failed to fetch user details.');
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="user-profile-section">
            {user?.avatar_url && (
              <div className="user-avatar-small">
                <img src={user.avatar_url} alt={user.name} />
              </div>
            )}
            <div className="user-greeting">
              <h2>Welcome back{user?.source === 'github' ? ' from GitHub' : ''}, {user?.name}!</h2>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn-header">
            Logout
          </button>
        </div>

        <div className="search-section">
          <div className="search-container">
            <h3>Search Developers & Repos</h3>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${searchType === 'users' ? 'users' : 'repositories'}...`}
                    className="search-input"
                    disabled={isSearching}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults(null);
                        setSelectedUser(null);
                        setCurrentPage(1);
                      }}
                      className="search-clear-btn"
                      aria-label="Clear search"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchResults(null);
                    setSelectedUser(null);
                    setCurrentPage(1);
                  }}
                  className="search-type-select"
                  disabled={isSearching}
                >
                  <option value="users">Users</option>
                  <option value="repos">Repositories</option>
                </select>
                <button type="submit" className="search-btn" disabled={isSearching || !searchQuery.trim()}>
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {loginError && <p className="error-message">{loginError}</p>}

          {selectedUser && (
            <div className="user-details-card">
              <button onClick={() => setSelectedUser(null)} className="close-btn">×</button>
              <div className="user-details-header">
                <img src={selectedUser.avatar_url} alt={selectedUser.name} className="user-details-avatar" />
                <div>
                  <h3>{selectedUser.name || selectedUser.login}</h3>
                  <p className="user-details-username">@{selectedUser.login}</p>
                </div>
              </div>
              {selectedUser.bio && <p className="user-details-bio">{selectedUser.bio}</p>}
              <div className="user-details-stats">
                <div className="stat-item">
                  <strong>{selectedUser.public_repos}</strong>
                  <span>Repositories</span>
                </div>
                <div className="stat-item">
                  <strong>{selectedUser.followers}</strong>
                  <span>Followers</span>
                </div>
                <div className="stat-item">
                  <strong>{selectedUser.following}</strong>
                  <span>Following</span>
                </div>
              </div>
              {selectedUser.location && <p className="user-details-info"> {selectedUser.location}</p>}
              {selectedUser.company && <p className="user-details-info"> {selectedUser.company}</p>}
              {selectedUser.blog && (
                <p className="user-details-info">
                  🔗 <a href={selectedUser.blog} target="_blank" rel="noopener noreferrer">{selectedUser.blog}</a>
                </p>
              )}
              <a
                href={selectedUser.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="github-profile-btn"
              >
                View on GitHub →
              </a>
            </div>
          )}

          {searchResults && !selectedUser && (
            <div className="search-results">
              <h4>
                {searchResults.total_count.toLocaleString()} {searchType === 'users' ? 'users' : 'repositories'} found
              </h4>
              <div className="results-grid">
                {searchResults.items.map((item) => (
                  <div
                    key={item.id}
                    className="result-card"
                    onClick={() => searchType === 'users' && handleUserClick(item.login)}
                    style={{ cursor: searchType === 'users' ? 'pointer' : 'default' }}
                  >
                    {searchType === 'users' ? (
                      <>
                        <img src={item.avatar_url} alt={item.login} className="result-avatar" />
                        <h4>{item.login}</h4>
                        <p className="result-type">User</p>
                        <a
                          href={item.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="result-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Profile →
                        </a>
                      </>
                    ) : (
                      <>
                        <div className="repo-header">
                          <h4>{item.name}</h4>
                          <span className="repo-language">{item.language || 'N/A'}</span>
                        </div>
                        <p className="repo-owner">by {item.owner.login}</p>
                        {item.description && <p className="repo-description">{item.description}</p>}
                        <div className="repo-stats">
                          <span>⭐ {item.stargazers_count.toLocaleString()}</span>
                          <span>🍴 {item.forks_count.toLocaleString()}</span>
                        </div>
                        <a
                          href={item.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="result-link"
                        >
                          View Repository →
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              {getTotalPages() > 1 && (
                <div className="pagination-container">
                  <div className="pagination-wrapper">
                    <div className="pagination-info-text">
                      Page: {currentPage}
                    </div>
                    <div className="pagination-controls">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isSearching}
                        className="pagination-nav-btn"
                        aria-label="Previous page"
                      >
                        ‹
                      </button>
                      
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="pagination-ellipsis">...</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(page)}
                              disabled={isSearching}
                              className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                              aria-label={`Page ${page}`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= getTotalPages() || isSearching}
                        className="pagination-nav-btn"
                        aria-label="Next page"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="image-section">
        <div className="image-content">
          <h1>Welcome to Platform</h1>
          <p>Join community and get started</p>
          <p>Experience seamless GitHub search</p>
          <div className="image-placeholder">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <circle cx="200" cy="150" r="80" fill="white" opacity="0.3" />
              <path d="M 150 150 L 200 120 L 250 150 L 200 180 Z" fill="white" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <div className="login-card">
          <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Enter your name"
                  className={errors.name ? 'error-input' : ''}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter your email"
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Enter your password"
                  className={errors.password ? 'error-input' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={handleChange}
                    value={formData.confirmPassword}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error-input' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle-btn"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
            )}

            {loginError && <p className="error-message">{loginError}</p>}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
            </button>

            <div className="form-footer">
              <p>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button type="button" onClick={toggleForm} className="toggle-btn">
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

