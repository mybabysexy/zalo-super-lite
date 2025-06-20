// Helper function for text limiting (if not already defined)
function limitText(text, maxLength) {
    if (!text) return '';
    maxLength = maxLength || 20;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getFriendsFromLocalStorage() {
    const friendsList = localStorage.getItem('friendsList');
    if (friendsList) {
        try {
            return JSON.parse(friendsList);
        } catch (e) {
            console.error('Error parsing friends list from localStorage:', e);
            return [];
        }
    }
    return [];
}

function getAuthUserFromLocalStorage() {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
        try {
            return JSON.parse(authUser);
        } catch (e) {
            console.error('Error parsing auth user from localStorage:', e);
            return null;
        }
    }
    return null;
}

function logout(redirect = true) {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('friendsList');
    if (redirect) {
        window.location.href = '/login';
    }
}

function animateSprite(url, duration, totalFrames) {
    // Create a sprite animation element
    var spriteElement = document.createElement('div');

    // Set up styling for the sprite element
    spriteElement.style.backgroundImage = 'url(' + url + ')';
    spriteElement.style.width = '100px';
    spriteElement.style.height = '100px';
    spriteElement.style.backgroundRepeat = 'no-repeat';
    spriteElement.style.backgroundSize = (totalFrames * 100) + 'px 100px';

    // IE8 doesn't support classList, use className instead
    spriteElement.className = 'animated-sprite';

    // Handle the case where there's only one frame
    if (totalFrames <= 1) {
        return spriteElement;
    }

    // Create a unique animation name to avoid conflicts
    var animationName = 'sprite-animation-' + Math.floor(Math.random() * 10000000);

    // Create keyframe animation dynamically for modern browsers
    var styleSheet = document.createElement('style');

    // Standard keyframes
    var keyframesRule = '@keyframes ' + animationName + ' {' +
        '0% { background-position: 0 0; }' +
        '100% { background-position: -' + ((totalFrames - 1) * 100) + 'px 0; }' +
        '}';

    // Add vendor prefixes for IE9/10 and other browsers
    keyframesRule += '@-webkit-keyframes ' + animationName + ' {' +
        '0% { background-position: 0 0; }' +
        '100% { background-position: -' + ((totalFrames - 1) * 100) + 'px 0; }' +
        '}';

    keyframesRule += '@-ms-keyframes ' + animationName + ' {' +
        '0% { background-position: 0 0; }' +
        '100% { background-position: -' + ((totalFrames - 1) * 100) + 'px 0; }' +
        '}';

    // IE8 doesn't support textContent, use innerText/innerHTML as fallback
    if (styleSheet.textContent !== undefined) {
        styleSheet.textContent = keyframesRule;
    } else {
        styleSheet.innerHTML = keyframesRule;
    }

    document.getElementsByTagName('head')[0].appendChild(styleSheet);

    // Apply the animation with vendor prefixes
    var animationValue = animationName + ' ' + (duration * totalFrames) + 'ms steps(' + (totalFrames - 1) + ') infinite';
    spriteElement.style.animation = animationValue;
    spriteElement.style.WebkitAnimation = animationValue;
    spriteElement.style.msAnimation = animationValue;

    // For IE8, implement a fallback using setTimeout
    if (!('animation' in spriteElement.style) && !('WebkitAnimation' in spriteElement.style)) {
        var currentFrame = 0;
        var interval = setInterval(function () {
            spriteElement.style.backgroundPosition = (-currentFrame * 100) + 'px 0';
            currentFrame = (currentFrame + 1) % totalFrames;
        }, duration);

        // Store the interval ID to allow stopping the animation
        spriteElement.setAttribute('data-animation-interval', interval);
    }

    return spriteElement;
}

document.addEventListener('DOMContentLoaded', function () {
    var socket = null;

    function connect() {
        // Get the token from the input field
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Vui lòng đăng nhập!');
        }

        try {
            // Create WebSocket connection with token in the URL
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = protocol + '//' + window.location.host + '?token=' + encodeURIComponent(token);

            // Create WebSocket connection with the token in URL
            socket = new WebSocket(wsUrl);
            window.zaloWebSocket = socket;

            socket.onopen = function () {
                console.log('WebSocket connection established');
                var event = document.createEvent('Event');
                event.initEvent('zaloWebSocketOpen', true, true);
                document.dispatchEvent(event);
            };

            socket.onclose = function (event) {
                if (event.code === 1000) {
                    console.log('Disconnected from WebSocket server');
                } else {
                    // If the connection was rejected due to authentication
                    window.location.href = '/login?error=' + encodeURIComponent('Token không hợp lệ hoặc đã hết hạn');
                }
            };

            socket.onerror = function (error) {
                console.log('WebSocket error: This may be due to invalid authentication');
            };
        } catch (error) {
            console.log('Error creating WebSocket: ' + error.message);
        }
    }

    function disconnect() {
        if (socket) {
            socket.close();
            socket = null;
        }
    }

    try {
        connect();
    } catch (error) {
        logout(false);
        window.location.href = '/login?error=' + encodeURIComponent(error.message);
    }

    function fetchAccountInfo() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        socket.send(JSON.stringify({ action: 'fetchAccountInfo' }));
    }

    function getAllFriends() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        socket.send(JSON.stringify({ action: 'getAllFriends' }));
    }

    function getMessages() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        socket.send(JSON.stringify({ action: 'getMessages' }));
    }

    function getChat(threadId) {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        socket.send(JSON.stringify({ action: 'getChat', threadId: threadId }));
    }

    function sendMessage(threadId, content) {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }
        console.log('Sending message:', { threadId: threadId, content: content });

        socket.send(JSON.stringify({ action: 'sendMessage', threadId: threadId, content: content }));
    }

    window.zalo = {
        connect: connect,
        disconnect: disconnect,
        getAllFriends: getAllFriends,
        getChat: getChat,
        fetchAccountInfo: fetchAccountInfo,
        sendMessage: sendMessage,
        getMessages: getMessages,
    }

    // messageForm.addEventListener('submit', function (e) {
    //     e.preventDefault();
    //     const message = messageInput.value.trim();
    //
    //     if (message && socket && socket.readyState === WebSocket.OPEN) {
    //         socket.send(message);
    //         addMessage('You: ' + message, 'user-message');
    //         messageInput.value = '';
    //     } else if (!socket || socket.readyState !== WebSocket.OPEN) {
    //         addMessage('Error: Not connected to server', 'error-message');
    //     }
    // });
});

document.addEventListener('zaloWebSocketOpen', function () {
    var authUser = getAuthUserFromLocalStorage();
    if (!authUser) {
        window.zalo.fetchAccountInfo();
    }
});
