# GitHub API Integration Setup

This app supports GitHub search functionality using GitHub's public API to find users and repositories, including their unique GitHub IDs.

## Features

1. **GitHub User Search**: Search for any GitHub user by username and view their public profile information including their unique GitHub ID
2. **GitHub Repository Search**: Search for repositories and view details like stars, forks, language, and description
3. **Real GitHub IDs**: Displays the actual GitHub user ID from GitHub's API
4. **Pagination**: Navigate through search results with 12 items per page
5. **User Profile Details**: Click on any user to see detailed profile information

## How to Use

### Step 1: Login to the Application

1. Use the login form with your email and password (or sign up for a new account)
2. After successful login, you'll be redirected to the dashboard

### Step 2: Search GitHub (Available After Login)

Once logged in, you'll see the search interface in the dashboard:

1. **Search Bar**: Enter any search query (e.g., "react", "torvalds", "facebook")
2. **Search Type**: Select either "Users" or "Repositories" from the dropdown
3. **Click Search**: The app will fetch results from GitHub's API
4. **View Results**: Browse through the results with pagination controls
5. **User Details**: Click on any user card to see their full profile including:
   - GitHub ID (unique identifier)
   - Username and name
   - Bio, location, company
   - Number of repositories, followers, and following
   - Link to view profile on GitHub

## GitHub API Endpoints Used

- **Search Users**: `https://api.github.com/search/users?q={query}`
  - Returns: List of users matching the search query
  - No authentication required for public profiles

- **Search Repositories**: `https://api.github.com/search/repositories?q={query}`
  - Returns: List of repositories matching the search query
  - Sorted by stars in descending order

- **Get User Details**: `https://api.github.com/users/{username}`
  - Returns: Complete user profile including ID, bio, stats, etc.
  - No authentication required for public profiles

## Example Response

When you search for a GitHub user, you'll get:
```json
{
  "id": 583231,
  "login": "octocat",
  "name": "The Octocat",
  "avatar_url": "https://github.com/images/error/octocat_happy.gif",
  "html_url": "https://github.com/octocat"
}
```

When you click on a user to see details:
```json
{
  "id": 583231,
  "login": "octocat",
  "name": "The Octocat",
  "email": "octocat@github.com",
  "avatar_url": "https://github.com/images/error/octocat_happy.gif",
  "bio": "GitHub's mascot",
  "location": "San Francisco",
  "company": "GitHub",
  "public_repos": 8,
  "followers": 1000,
  "following": 500,
  "created_at": "2011-01-25T18:44:36Z"
}
```

The **ID** field is the unique GitHub user ID that identifies the user.

## Search Features

- **Pagination**: Results are paginated with 12 items per page
- **Clear Search**: Click the X icon in the search box to clear your search
- **Switch Types**: Toggle between searching Users and Repositories
- **Direct Links**: Click "View on GitHub" to open profiles/repositories in a new tab

## Notes

- **No Setup Required**: All GitHub API calls use public endpoints - no authentication needed
- **Rate Limits**: GitHub API has rate limits (60 requests/hour for unauthenticated requests)
- **Data Storage**: Search results and user data are stored in localStorage for demo purposes
- **Production**: For production use, consider implementing proper authentication and backend API handling

## Tips

- Use specific usernames for better results (e.g., "torvalds" instead of "linus")
- Repository search supports complex queries (e.g., "language:javascript stars:>1000")
- Click on user cards to see detailed profiles
- Use pagination to browse through all search results
