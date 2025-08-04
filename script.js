document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeTabSwitching();
    initializeCodeCopying();
    initializeFAQAccordion();
    initializeScrollAnimations();
    initializeMethodCards();
    initializeSmoothScrolling();
});

// Tab switching functionality
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Code copying functionality
function initializeCodeCopying() {
    // Add copy buttons to code blocks that don't have them
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        if (!block.querySelector('.copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = '复制';
            copyBtn.onclick = function() { copyCode(this); };
            block.appendChild(copyBtn);
        }
    });
}

// Copy code function
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('pre code') || codeBlock.querySelector('pre');
    
    if (code) {
        const text = code.textContent || code.innerText;
        
        // Try to use the modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess(button);
            }).catch(() => {
                fallbackCopyText(text, button);
            });
        } else {
            fallbackCopyText(text, button);
        }
    }
}

// Fallback copy method for older browsers
function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showCopyError(button);
    }
    
    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '已复制!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Show copy error feedback
function showCopyError(button) {
    const originalText = button.textContent;
    button.textContent = '复制失败';
    button.style.background = '#ef4444';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// FAQ accordion functionality
function initializeFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle current item
            const isOpen = faqItem.classList.contains('open');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
                const ans = item.querySelector('.faq-answer');
                if (ans) {
                    ans.style.maxHeight = '0';
                    ans.style.opacity = '0';
                }
            });
            
            // If this item wasn't open, open it
            if (!isOpen) {
                faqItem.classList.add('open');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                }
            }
        });
    });
    
    // Set initial styles for FAQ answers
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
    });
}

// Scroll animations
function initializeScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all major sections
    const sections = document.querySelectorAll('.intro-section, .methods-section, .method-detail, .tips-section, .faq-section, .summary-section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe cards with staggered animation
    const cards = document.querySelectorAll('.advantage-card, .method-card, .contact-item');
    cards.forEach((card, index) => {
        setTimeout(() => {
            observer.observe(card);
        }, index * 100);
    });
}

// Method cards interaction
function initializeMethodCards() {
    const methodCards = document.querySelectorAll('.method-card');
    
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            const targetSection = document.getElementById(`method-${method}`);
            
            if (targetSection) {
                // Smooth scroll to the target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight effect
                targetSection.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)';
                setTimeout(() => {
                    targetSection.style.boxShadow = '';
                }, 2000);
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility function to add loading states
function addLoadingState(element, text = '加载中...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `<span style="opacity: 0.6;">${text}</span>`;
    element.disabled = true;
    
    return () => {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// Contact info copy functionality
function initializeContactCopy() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const contactValue = this.querySelector('.contact-info span');
            if (contactValue) {
                const text = contactValue.textContent;
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        showContactCopyFeedback(this, '已复制!');
                    });
                } else {
                    fallbackCopyText(text, this);
                }
            }
        });
    });
}

// Show contact copy feedback
function showContactCopyFeedback(element, message) {
    const originalTransform = element.style.transform;
    element.style.transform = 'scale(0.95)';
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    element.style.position = 'relative';
    element.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
    
    setTimeout(() => {
        element.style.transform = originalTransform;
    }, 150);
}

// Activation code copy functionality
function initializeActivationCodeCopy() {
    const codeItems = document.querySelectorAll('.code-item');
    
    codeItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent;
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showActivationCodeFeedback(this);
                });
            } else {
                fallbackCopyText(text, this);
            }
        });
    });
}

// Show activation code copy feedback
function showActivationCodeFeedback(element) {
    const originalBg = element.style.background;
    const originalColor = element.style.color;
    
    element.style.background = '#10b981';
    element.style.color = 'white';
    element.textContent = '已复制!';
    
    setTimeout(() => {
        element.style.background = originalBg;
        element.style.color = originalColor;
        // Restore original text - you might want to store this differently
        element.textContent = element.getAttribute('data-original-text') || '激活码';
    }, 2000);
}

// Add keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key to close any open FAQ items
        if (e.key === 'Escape') {
            document.querySelectorAll('.faq-item.open').forEach(item => {
                item.classList.remove('open');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                }
            });
        }
        
        // Arrow keys for tab navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab) {
                const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
                const currentIndex = tabButtons.indexOf(activeTab);
                let nextIndex;
                
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
                } else {
                    nextIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
                }
                
                tabButtons[nextIndex].click();
                tabButtons[nextIndex].focus();
                e.preventDefault();
            }
        }
    });
}

// Initialize performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Add scroll-based effects here if needed
        }, 10);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could add error reporting here
});

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeContactCopy();
    initializeActivationCodeCopy();
    initializeKeyboardNavigation();
    initializePerformanceOptimizations();
});

// Utility functions for external use
window.ClaudeCodeUtils = {
    copyText: function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            return new Promise((resolve, reject) => {
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    },
    
    scrollToElement: function(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },
    
    addNotification: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.ClaudeCodeUtils;
}