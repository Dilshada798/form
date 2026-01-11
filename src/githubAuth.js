
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
const GITHUB_REDIRECT_URI = `${window.location.origin}/auth/github/callback`;

export const getGitHubAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'read:user user:email',
    state: Math.random().toString(36).substring(7), // Random state for security
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

export const getGitHubUserData = async (code) => {
  try {
    const response = await fetch(`https://api.github.com/user`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    throw error;
  }
};

export const getGitHubUserByUsername = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }
    
    const userData = await response.json();
    return {
      id: userData.id,
      login: userData.login,
      name: userData.name || userData.login,
      email: userData.email,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
    };
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    throw error;
  }
};

// Search GitHub users
export const searchGitHubUsers = async (query, page = 1, perPage = 10) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search users');
    }
    
    const data = await response.json();
    return {
      total_count: data.total_count,
      items: data.items.map(user => ({
        id: user.id,
        login: user.login,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        type: user.type,
      })),
    };
  } catch (error) {
    console.error('Error searching GitHub users:', error);
    throw error;
  }
};

// Search GitHub repositories
export const searchGitHubRepos = async (query, page = 1, perPage = 10) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort=stars&order=desc`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search repositories');
    }
    
    const data = await response.json();
    return {
      total_count: data.total_count,
      items: data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
        },
      })),
    };
  } catch (error) {
    console.error('Error searching GitHub repositories:', error);
    throw error;
  }
};

// Get detailed user information
export const getGitHubUserDetails = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }
    
    const userData = await response.json();
    return {
      id: userData.id,
      login: userData.login,
      name: userData.name || userData.login,
      email: userData.email,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      blog: userData.blog,
      location: userData.location,
      company: userData.company,
      public_repos: userData.public_repos,
      public_gists: userData.public_gists,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
      html_url: userData.html_url,
    };
  } catch (error) {
    console.error('Error fetching GitHub user details:', error);
    throw error;
  }
};

