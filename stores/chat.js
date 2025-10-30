import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    currentSession: null,
    sessions: [],
    isOpen: false,
    isTyping: false,
    isMinimized: false,
  }),

  getters: {
    currentMessages() {
      return this.currentSession?.messages || [];
    },

    hasMessages() {
      return (this.currentSession?.messages.length || 0) > 0;
    },

    sessionCount() {
      return this.sessions.length;
    },
  },

  actions: {
    initSession() {
      if (!this.currentSession) {
        const session = {
          id: Date.now().toString(),
          messages: [
            {
              id: "1",
              role: "assistant",
              content:
                "سلام! من دستیار هوشمند MediCare+ هستم. می‌توانم به شما کمک کنم در:\n\n• پیدا کردن داروی مناسب\n• آشنایی با نحوه مصرف محصولات\n• بررسی تداخلات دارویی\n• ارائه توصیه‌های عمومی سلامت\n\nچطور می‌توانم امروز به شما کمک کنم؟",
              timestamp: new Date(),
              suggestedActions: [
                {
                  label: "داروهای ضددرد",
                  action: "search",
                  data: "مسکن",
                },
                {
                  label: "بررسی ویتامین‌ها",
                  action: "search",
                  data: "ویتامین",
                },
                { label: "صحبت با داروساز", action: "contact_pharmacist" },
              ],
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.currentSession = session;
        this.sessions.push(session);
        this.saveToStorage();
      }
    },

    async sendMessage(content) {
      if (!this.currentSession) {
        this.initSession();
      }

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      this.currentSession.messages.push(userMessage);
      this.isTyping = true;
      this.saveToStorage();

      // Simulate AI response (replace with actual API call)
      await this.generateAIResponse(content);
    },

    async generateAIResponse(userMessage) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = this.getContextualResponse(userMessage);

      const assistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        products: response.products,
        suggestedActions: response.suggestedActions,
      };

      this.currentSession.messages.push(assistantMessage);
      this.currentSession.updatedAt = new Date();
      this.isTyping = false;
      this.saveToStorage();
    },

    getContextualResponse(message) {
      const lowerMessage = message.toLowerCase();

      // Pain/headache related
      if (
        lowerMessage.includes("pain") ||
        lowerMessage.includes("headache") ||
        lowerMessage.includes("ache")
      ) {
        return {
          content:
            "For pain relief, I can recommend several options:\n\n**Ibuprofen 200mg** - Fast-acting for general pain and inflammation\n**Acetaminophen 500mg** - Gentle on the stomach, good for headaches\n**Aspirin 81mg** - Low-dose for chronic pain management\n\nAll these are available over-the-counter. Would you like me to add any of these to your cart? If pain persists for more than a few days, please consult with a healthcare professional.",
          products: [
            {
              id: "2",
              name: "Ibuprofen 200mg",
              category: "PAIN RELIEF",
              price: 8.49,
              rating: 4.7,
              reviewCount: 892,
              image: "/images/products/ibuprofen.jpg",
              inStock: true,
            },
          ],
          suggestedActions: [
            { label: "Add to Cart", action: "add_to_cart", data: "2" },
            {
              label: "View All Pain Relief",
              action: "search",
              data: "pain relief",
            },
            { label: "Talk to Pharmacist", action: "contact_pharmacist" },
          ],
        };
      }

      // Vitamin related
      if (
        lowerMessage.includes("vitamin") ||
        lowerMessage.includes("supplement") ||
        lowerMessage.includes("immune")
      ) {
        return {
          content:
            "I can help you with vitamins and supplements!\n\n**Vitamin D3 5000 IU** - Essential for bone health and immune support\n**Vitamin C 1000mg** - Boosts immune system\n**Multivitamin Daily** - Complete daily nutrition\n\nThese are our most popular supplements. Would you like more information about any specific vitamin?",
          products: [
            {
              id: "1",
              name: "Vitamin D3 5000 IU",
              category: "SUPPLEMENTS",
              price: 12.99,
              originalPrice: 16.99,
              rating: 4.8,
              reviewCount: 1247,
              image: "/images/products/vitamin-d3.jpg",
              inStock: true,
            },
          ],
          suggestedActions: [
            { label: "View Vitamin D3", action: "view_product", data: "1" },
            {
              label: "Browse All Vitamins",
              action: "search",
              data: "vitamins",
            },
          ],
        };
      }

      // Cold/flu related
      if (
        lowerMessage.includes("cold") ||
        lowerMessage.includes("flu") ||
        lowerMessage.includes("cough")
      ) {
        return {
          products: [],
          content:
            "For cold and flu symptoms, here are my recommendations:\n\nâ€¢ **Rest and hydration** are most important\nâ€¢ **Acetaminophen or Ibuprofen** for fever and body aches\nâ€¢ **Vitamin C** to support immune function\nâ€¢ **Cough syrup** if you have a persistent cough\n\nWould you like me to help you find specific cold and flu medications?",
          suggestedActions: [
            { label: "Find Cold Medicine", action: "search", data: "cold flu" },
            { label: "Talk to Pharmacist", action: "contact_pharmacist" },
          ],
        };
      }

      // Drug interaction check
      if (
        lowerMessage.includes("interaction") ||
        lowerMessage.includes("take together") ||
        lowerMessage.includes("safe")
      ) {
        return {
          content:
            "Drug interactions are important to consider! I can help with general information, but for specific medical advice, I recommend:\n\n1. Consulting with our licensed pharmacist (available 24/7)\n2. Checking with your doctor\n3. Reading the medication leaflet\n\nWould you like to connect with a pharmacist right now?",
          suggestedActions: [
            { label: "Talk to Pharmacist Now", action: "contact_pharmacist" },
            { label: "Learn More", action: "search", data: "drug safety" },
          ],
        };
      }

      // Delivery/shipping related
      // @ts-ignore
      if (
        lowerMessage.includes("deliver") ||
        lowerMessage.includes("shipping") ||
        lowerMessage.includes("how long")
      ) {
        // @ts-ignore
        return {
          content: "",
          suggestedActions: [
            { label: "Browse Products", action: "search", data: "all" },
            {
              label: "Check Delivery Areas",
              action: "view_product",
              data: "delivery",
            },
          ],
        };
      }

      // Default response
      return {
        content:
          "I'm here to help! I can assist you with:\n\nâ€¢ Finding medications and health products\nâ€¢ Understanding how to use products safely\nâ€¢ General health information\nâ€¢ Order and delivery questions\n\nCould you tell me more about what you're looking for? Or would you like to browse our categories?",
        suggestedActions: [
          {
            label: "Browse Medications",
            action: "search",
            data: "medications",
          },
          {
            label: "View Health Products",
            action: "search",
            data: "health products",
          },
          { label: "Talk to Pharmacist", action: "contact_pharmacist" },
        ],
      };
    },

    clearCurrentSession() {
      this.currentSession = null;
      this.saveToStorage();
    },

    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen && !this.currentSession) {
        this.initSession();
      }
    },

    minimizeChat() {
      this.isMinimized = true;
    },

    maximizeChat() {
      this.isMinimized = false;
    },

    closeChat() {
      this.isOpen = false;
    },

    // Manual persistence methods
    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem("chat-sessions", JSON.stringify(this.sessions));
      }
    },

    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem("chat-sessions");
        if (saved) {
          try {
            this.sessions = JSON.parse(saved);
            // Restore the most recent session
            if (this.sessions.length > 0) {
              this.currentSession = this.sessions[this.sessions.length - 1];
            }
          } catch (e) {
            console.error("Failed to load chat from storage", e);
          }
        }
      }
    },
  },
});
