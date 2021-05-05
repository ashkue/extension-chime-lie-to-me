
(() => {
	function drawLine(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	function setText(text) {
		statusElement.innerText = ' (' + text + ')';
	}

	const emotions = [
		"angry",
		"disgust",
		"fear",
		"happy",
		"neutral",
		"sad",
		"surprise",
	];
	let emotionModel = null;

	let output = null;
	let model = null;

	let videoElement = null;
	let statusElement = null;

	let modelReady = false;
	let videoReady = false;
	let currentVideos = null;

	async function predictEmotion(points) {
		let result = tf.tidy(() => {
			const xs = tf.stack([tf.tensor1d(points)]);
			return emotionModel.predict(xs);
		});
		let prediction = await result.data();
		result.dispose();
		// Get the index of the maximum value
		let id = prediction.indexOf(Math.max(...prediction));
		return emotions[id];
	}

	async function trackFace() {
		const video = videoElement;
		const faces = await model.estimateFaces({
			input: video,
			returnTensors: false,
			flipHorizontal: false,
		});
		output.drawImage(
			video,
			0,
			0,
			video.clientWidth,
			video.clientHeight,
			0,
			0,
			video.clientWidth,
			video.clientHeight
		);

		let points = null;
		faces.forEach((face) => {
			// Draw the bounding box
			const x1 = face.boundingBox.topLeft[0];
			const y1 = face.boundingBox.topLeft[1];
			const x2 = face.boundingBox.bottomRight[0];
			const y2 = face.boundingBox.bottomRight[1];
			const bWidth = x2 - x1;
			const bHeight = y2 - y1;
			drawLine(output, x1, y1, x2, y1);
			drawLine(output, x2, y1, x2, y2);
			drawLine(output, x1, y2, x2, y2);
			drawLine(output, x1, y1, x1, y2);

			// Add just the nose, cheeks, eyes, eyebrows & mouth
			const features = [
				"noseTip",
				"leftCheek",
				"rightCheek",
				"leftEyeLower1",
				"leftEyeUpper1",
				"rightEyeLower1",
				"rightEyeUpper1",
				"leftEyebrowLower", //"leftEyebrowUpper",
				"rightEyebrowLower", //"rightEyebrowUpper",
				"lipsLowerInner", //"lipsLowerOuter",
				"lipsUpperInner", //"lipsUpperOuter",
			];
			points = [];
			features.forEach((feature) => {
				face.annotations[feature].forEach((x) => {
					points.push((x[0] - x1) / bWidth);
					points.push((x[1] - y1) / bHeight);
				});
			});
		});

		if (points) {
			let emotion = await predictEmotion(points);
			setText(emotion);
		}

		if (videoReady) {
			requestAnimationFrame(trackFace);
		}
	}

	async function activateVideos($event) {
		let interval = null;

		// cleanup
		videoReady = false;
		if(interval) {
			clearInterval(interval);
		}
		if(videoElement) {
			$(videoElement).parent().find("header > span.status").remove();
			$(videoElement).parent().find("canvas").remove();
		}

		const video = currentVideos[$event.target.value];
		videoElement = video;
		// Check if the video element is ready every 500ms
		interval = setInterval(async () => {
			console.log('video.readyState: ', video.readyState);
			if (video.readyState >= 3) {			
				clearInterval(interval);
				//console.log('video loaded!');
				//let videoWidth = video.videoWidth;
				//let videoHeight = video.videoHeight;
				//video.width = videoWidth;
				//video.height = videoHeight;

				statusElement = document.createElement("span");
				statusElement.style.padding = "10px 5px";
				statusElement.className = "status";		
				$(video).parent().find("header").append($(statusElement));

				canvas = document.createElement("canvas");
				canvas.width = video.clientWidth;
				canvas.height = video.clientHeight;
				$(canvas).insertBefore(video);

				output = canvas.getContext("2d");
				output.translate(canvas.width, 0);
				output.scale(-1, 1); // Mirror cam
				output.fillStyle = "#fdffb6";
				output.strokeStyle = "#fdffb6";
				output.lineWidth = 2;
				videoReady = true;
				trackFace();	
			}
		}, 500);
	}

	async function processVideos(videos) {
		if(!modelReady) {
			// Load Face Landmarks Detection
			model = await faceLandmarksDetection.load(
				faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
			);
			// Load Emotion Detection
			emotionModel = await tf.loadLayersModel(chrome.extension.getURL('models/facemo.json'));
		}

		currentVideos = videos;
		if (currentVideos.length < 1) {
			return;
		}

		for (let i = 0; i < currentVideos.length; i++) {
			activator = document.createElement("button");
			activator.innerText = "Lie to Me";
			activator.style.margin = "0 5px";
			activator.value = i;
			$(currentVideos[i]).parent().find("header > button").remove();
			$(currentVideos[i]).parent().find("header").append($(activator));
			$(activator).on('click', activateVideos);
		};
	}


	(() => {
		var videoCount = 0;
		var observer = new MutationObserver(function (mutations) {
			let elements = $("div.VideoTilesWrapper > div > div > div > video");
			if (elements.length != videoCount) {
				console.log("Video elemnts changed");
				videoCount = elements.length;
				processVideos(elements);
			}
		});

		// Start observing
		observer.observe(document.body, { childList: true, subtree: true });
	})();
})();