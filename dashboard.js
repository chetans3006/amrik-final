// Dashboard Application
class LearningDashboard {
  constructor() {
    this.currentUser = null;
    this.currentSection = "videos";
    this.videos = [];
    this.favorites = [];
    this.init();
  }

  init() {
    this.loadUserData();
    this.loadVideos();
    this.setupEventListeners();
    this.updateUI();
  }

  loadUserData() {
    // Get user data from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const userData = urlParams.get("user");

    if (userData) {
      try {
        this.currentUser = JSON.parse(decodeURIComponent(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Fallback to demo user if no data found
    if (!this.currentUser) {
      this.currentUser = {
        name: "Demo User",
        role: "Student",
        email: "demo@example.com",
      };
    }

    // Load favorites from localStorage
    try {
      const savedFavorites = localStorage.getItem("userFavorites");
      if (savedFavorites) {
        this.favorites = JSON.parse(savedFavorites);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }

  loadVideos() {
    // Demo video data
    this.videos = [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        description:
          "Learn the basics of JavaScript programming including variables, functions, and control structures.",
        category: "programming",
        duration: "45:30",
        thumbnail: "🟨",
        videoUrl: "/placeholder.mp4",
        instructor: "John Smith",
        views: 1250,
        rating: 4.8,
      },
      {
        id: 2,
        title: "React Components Deep Dive",
        description:
          "Master React components, props, state management, and lifecycle methods.",
        category: "programming",
        duration: "1:12:45",
        thumbnail: "⚛️",
        videoUrl: "/placeholder.mp4",
        instructor: "Sarah Johnson",
        views: 890,
        rating: 4.9,
      },
      {
        id: 3,
        title: "UI/UX Design Principles",
        description:
          "Understand the core principles of user interface and user experience design.",
        category: "design",
        duration: "38:20",
        thumbnail: "🎨",
        videoUrl: "/placeholder.mp4",
        instructor: "Mike Chen",
        views: 2100,
        rating: 4.7,
      },
      {
        id: 4,
        title: "CSS Grid and Flexbox",
        description:
          "Master modern CSS layout techniques with Grid and Flexbox.",
        category: "programming",
        duration: "52:15",
        thumbnail: "📐",
        videoUrl: "/placeholder.mp4",
        instructor: "Emily Davis",
        views: 1680,
        rating: 4.6,
      },
      {
        id: 5,
        title: "Business Strategy Basics",
        description:
          "Learn fundamental business strategy concepts and frameworks.",
        category: "business",
        duration: "1:05:30",
        thumbnail: "📊",
        videoUrl: "/placeholder.mp4",
        instructor: "Robert Wilson",
        views: 750,
        rating: 4.5,
      },
      {
        id: 6,
        title: "Spanish Conversation Practice",
        description:
          "Practice Spanish conversation skills with real-world scenarios.",
        category: "language",
        duration: "35:45",
        thumbnail: "🗣️",
        videoUrl: "/placeholder.mp4",
        instructor: "Maria Rodriguez",
        views: 920,
        rating: 4.8,
      },
      {
        id: 7,
        title: "Node.js Backend Development",
        description:
          "Build scalable backend applications with Node.js and Express.",
        category: "programming",
        duration: "1:25:10",
        thumbnail: "🟢",
        videoUrl: "/placeholder.mp4",
        instructor: "David Kim",
        views: 1340,
        rating: 4.7,
      },
      {
        id: 8,
        title: "Photoshop for Beginners",
        description:
          "Learn essential Photoshop tools and techniques for photo editing.",
        category: "design",
        duration: "48:55",
        thumbnail: "🖼️",
        videoUrl: "/placeholder.mp4",
        instructor: "Lisa Thompson",
        views: 1890,
        rating: 4.6,
      },
    ];
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = e.target.getAttribute("data-section");
        this.switchSection(section);
      });
    });

    // Search functionality
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.querySelector(".search-btn");

    searchInput.addEventListener("input", () => this.filterVideos());
    searchBtn.addEventListener("click", () => this.filterVideos());

    // Category filter
    document.getElementById("categoryFilter").addEventListener("change", () => {
      this.filterVideos();
    });

    // User actions
    document.getElementById("logoutBtn").addEventListener("click", () => {
      this.logout();
    });

    document.getElementById("profileBtn").addEventListener("click", () => {
      this.showProfile();
    });

    // Video modal
    document.getElementById("closeVideoModal").addEventListener("click", () => {
      this.closeVideoModal();
    });

    // Modal backdrop click
    document.getElementById("videoModal").addEventListener("click", (e) => {
      if (e.target.id === "videoModal") {
        this.closeVideoModal();
      }
    });

    // Video modal actions
    document.getElementById("favoriteBtn").addEventListener("click", () => {
      this.toggleFavorite();
    });

    document.getElementById("downloadBtn").addEventListener("click", () => {
      this.downloadVideo();
    });

    document.getElementById("shareBtn").addEventListener("click", () => {
      this.shareVideo();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeVideoModal();
      }
    });
  }

  updateUI() {
    // Update user info
    document.getElementById("userName").textContent = this.currentUser.name;
    document.getElementById("userRole").textContent = this.currentUser.role;

    // Render videos
    this.renderVideos();
    this.renderFavorites();
  }

  switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-section="${sectionName}"]`)
      .parentElement.classList.add("active");

    // Update content
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(`${sectionName}-section`).classList.add("active");

    this.currentSection = sectionName;

    // Update content based on section
    if (sectionName === "favorites") {
      this.renderFavorites();
    }
  }

  renderVideos(videosToRender = this.videos) {
    const videoGrid = document.getElementById("videoGrid");
    videoGrid.innerHTML = "";

    videosToRender.forEach((video) => {
      const videoCard = this.createVideoCard(video);
      videoGrid.appendChild(videoCard);
    });
  }

  createVideoCard(video) {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
            <div class="video-thumbnail">
                <div style="font-size: 4rem;">${video.thumbnail}</div>
                <button class="play-button">▶️</button>
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
                <div class="video-meta">
                    <span class="video-category">${video.category}</span>
                    <span>${video.views} views</span>
                </div>
            </div>
        `;

    card.addEventListener("click", () => {
      this.openVideoModal(video);
    });

    return card;
  }

  filterVideos() {
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const selectedCategory = document.getElementById("categoryFilter").value;

    const filteredVideos = this.videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.instructor.toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.renderVideos(filteredVideos);
  }

  openVideoModal(video) {
    const modal = document.getElementById("videoModal");
    const videoPlayer = document.getElementById("videoPlayer");
    const modalTitle = document.getElementById("modalVideoTitle");
    const modalDescription = document.getElementById("modalVideoDescription");

    modalTitle.textContent = video.title;
    modalDescription.innerHTML = `
            <p><strong>Instructor:</strong> ${video.instructor}</p>
            <p><strong>Duration:</strong> ${video.duration}</p>
            <p><strong>Category:</strong> ${video.category}</p>
            <p><strong>Rating:</strong> ${"⭐".repeat(
              Math.floor(video.rating)
            )} (${video.rating})</p>
            <p><strong>Views:</strong> ${video.views.toLocaleString()}</p>
            <br>
            <p>${video.description}</p>
        `;

    // Set video source (placeholder for demo)
    videoPlayer.src = video.videoUrl;

    // Update favorite button
    const favoriteBtn = document.getElementById("favoriteBtn");
    const isFavorite = this.favorites.includes(video.id);
    favoriteBtn.textContent = isFavorite
      ? "⭐ Remove from Favorites"
      : "⭐ Add to Favorites";
    favoriteBtn.setAttribute("data-video-id", video.id);

    modal.classList.add("show");

    // Track video view (in a real app, this would be sent to the server)
    this.trackVideoView(video.id);
  }

  closeVideoModal() {
    const modal = document.getElementById("videoModal");
    const videoPlayer = document.getElementById("videoPlayer");

    modal.classList.remove("show");
    videoPlayer.pause();
    videoPlayer.src = "";
  }

  toggleFavorite() {
    const favoriteBtn = document.getElementById("favoriteBtn");
    const videoId = Number.parseInt(favoriteBtn.getAttribute("data-video-id"));

    const isFavorite = this.favorites.includes(videoId);

    if (isFavorite) {
      this.favorites = this.favorites.filter((id) => id !== videoId);
      favoriteBtn.textContent = "⭐ Add to Favorites";
    } else {
      this.favorites.push(videoId);
      favoriteBtn.textContent = "⭐ Remove from Favorites";
    }

    // Save to localStorage
    try {
      localStorage.setItem("userFavorites", JSON.stringify(this.favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }

    // Update favorites section if currently viewing
    if (this.currentSection === "favorites") {
      this.renderFavorites();
    }
  }

  renderFavorites() {
    const favoritesGrid = document.getElementById("favoritesGrid");
    const favoriteVideos = this.videos.filter((video) =>
      this.favorites.includes(video.id)
    );

    if (favoriteVideos.length === 0) {
      favoritesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #64748b;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
                    <h3>No favorite videos yet</h3>
                    <p>Start adding videos to your favorites to see them here!</p>
                </div>
            `;
      return;
    }

    favoritesGrid.innerHTML = "";
    favoriteVideos.forEach((video) => {
      const videoCard = this.createVideoCard(video);
      favoritesGrid.appendChild(videoCard);
    });
  }

  downloadVideo() {
    // In a real app, this would initiate a download
    alert(
      "Download functionality would be implemented here. The video would be downloaded to your device."
    );
  }

  shareVideo() {
    const videoTitle = document.getElementById("modalVideoTitle").textContent;

    if (navigator.share) {
      navigator.share({
        title: videoTitle,
        text: `Check out this learning video: ${videoTitle}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = window.location.href;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Video link copied to clipboard!");
        })
        .catch(() => {
          alert(`Share this video: ${shareUrl}`);
        });
    }
  }

  trackVideoView(videoId) {
    // In a real app, this would send analytics data to the server
    console.log(`Video ${videoId} viewed by user ${this.currentUser.email}`);

    // Update local view count (demo purposes)
    const video = this.videos.find((v) => v.id === videoId);
    if (video) {
      video.views += 1;
    }
  }

  showProfile() {
    alert(
      `Profile Information:\n\nName: ${this.currentUser.name}\nRole: ${this.currentUser.role}\nEmail: ${this.currentUser.email}\n\nProfile editing would be implemented here.`
    );
  }

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      // Clear any stored session data
      try {
        localStorage.removeItem("userSession");
      } catch (error) {
        console.error("Error clearing session:", error);
      }

      // Redirect to login page
      window.location.href = "index.html";
    }
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new LearningDashboard();
});

// Console welcome message
console.log(
  "%c📚 Learning Dashboard Loaded",
  "color: #667eea; font-size: 16px; font-weight: bold;"
);
console.log("Dashboard features:");
console.log("🎥 Video library with search and filtering");
console.log("⭐ Favorites system");
console.log("📊 Progress tracking");
console.log("🏆 Certificates");
console.log("⚙️ Settings");
