var DetectionMixin = {
	data() {
		return {
			extensionInstalled: false
		};
	},
	async mounted() {
		// Liked presences initialization:
		this.$store.commit("presences/initializeLikedPresences", localStorage);

		const Checker = new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve(
					document.getElementById("app").getAttribute("extension-ready") ==
						"true"
				);
			}, 500);
		});

		await Checker.then(result => {
			if (result) {
				this.$store.commit("extension/setInstalled", true);
			} else {
				this.$store.commit("extension/setInstalled", false);
			}
		});

		if (this.$store.state.extension.extensionInstalled) {
			this.$data.extensionInstalled = true;
			this.debugMessage("Extension installed, unlocking functions...");
		} else {
			this.$data.extensionInstalled = false;
			this.errorMessage("Extension not found, locking functions...");
		}

		// Registering Vue hook.
		var self = this;

		// Catching response event from extension after we'll fire `PreMiD_GetPresenceList`.
		window.addEventListener("PreMiD_GetWebisteFallback", function(data) {
			var dataString = data.detail.toString().split(",");
			self.$store.commit("presences/set", dataString);
			self.debugMessage("Recieved information from Extension!");
		});

		// Firing event to get response from Extension with installed presences data.
		var event = new CustomEvent("PreMiD_GetPresenceList", {});
		window.dispatchEvent(event);
	}
};

export default DetectionMixin;
