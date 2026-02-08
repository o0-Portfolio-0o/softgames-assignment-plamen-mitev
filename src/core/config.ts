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
		},
		magicWords: {
			emojiParser: {
				baseLineOffset: 4,
				fontSizeMultiplier: 1.1,
				widthOffset: 4,
				style: {
					fontFamily: 'monospace',
					fontSize: 22,
					fill: 0xffffff
				}
			},
			dialogBubble: {
				padding: 12,
				startOffset: 2,
				avatarHeight: 64,
				zIndex: {
					bg: 0,
					avatar: 1,
					name: 2,
					emoji: 2,
				},
				styles: {
					name: {
						fontFamily: 'monospace',
						fontSize: 20,
						fill: 0xffea07,
					},
					emojiText: {
						fontSize: 22,
						offsetY: 6,
					}
				}
			},
			dialogManager: {
				displayTime: 1500,
				positions: {
					leftX: 40,
					offset: {
						y: 60,
					},
				}
			}
		}
	}
}

export default baseConfig;