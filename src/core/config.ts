const baseConfig = {
	ui: {
		title: {
			label: 'Softgames Assignment Plamen Mitev',
			anchor: 0.5,
			position: {
				y: 100,
			},
			style: {
				fill: "#ffffff",
				fontSize: 32,
			}
		},
		backButton: {
			label: '<- Back',
			position: {
				y: 10,
			},
			style: {
				fill: "#00ffcc",
				fontSize: 24
			}
		},
		actionButton: {
			position: {

			},
			style: {
				fill: "#00ffcc",
				fontSize: 24,
			}
		}
	},
	games: {
		aceOfShadows: {
			totalCards: 144,
			anchor: 0.5,
			yOffset: 2,
			flyDelayMs: 1000,
			sourceStack: {
				position: {
					xOffset: 0.3,
					yOffset: 2,
				}
			},
			targetStack: {
				position: {
					xOffset: 0.7,
					yOffset: 2,
				},
				animations: {
					flightDuration: 2,
					arcHeight: 40,
					flying: {
						ease: "power2.out"
					},
					scaling: {
						scale: {
							to: 1.05,
							reset: 1,
						},
						ease: {
							out: "sine.out",
							in: "sine.in"
						}
					}
				}
			}
		},
		phoenixFlame: {
			maxParticles: 10,
			anchor: 0.5,
			blendMode: "add"
		}
	}
}

export default baseConfig;