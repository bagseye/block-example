(function (wp) {
	/**
	 * Registers a new block provided a unique name and an object defining its behavior.
	 *
	 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
	 */
	var registerBlockType = wp.blocks.registerBlockType;

	/**
	 * Returns a new element of given type. Element is an abstraction layer atop React.
	 *
	 * @see https://developer.wordpress.org/block-editor/packages/packages-element/
	 */
	var el = wp.element.createElement;

	/**
	 * Retrieves the translation of text.
	 *
	 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
	 */
	var __ = wp.i18n.__;

	var MediaUpload = wp.blockEditor.MediaUpload;
	var RichText = wp.blockEditor.RichText;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody = wp.components.PanelBody;

	/**
	 * Every block starts by registering a new block type definition.
	 *
	 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
	 */
	registerBlockType("create-block/perk", {
		/**
		 * This is the display title for your block, which can be translated with `i18n` functions.
		 * The block inserter will show this name.
		 */
		title: __("Perk", "perk"),

		/**
		 * This is a short description for your block, can be translated with `i18n` functions.
		 * It will be shown in the Block Tab in the Settings Sidebar.
		 */
		description: __(
			"An individual perk, that displays an image, title, and subtext.",
			"perk"
		),

		/**
		 * Blocks are grouped into categories to help users browse and discover them.
		 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
		 */
		category: "widgets",

		/**
		 * An icon property should be specified to make it easier to identify a block.
		 * These can be any of WordPress’ Dashicons, or a custom svg element.
		 */
		icon: "buddicons-groups",

		/**
		 * Optional block extended support features.
		 */
		supports: {
			// Removes support for an HTML mode.
			html: false,
		},

		attributes: {
			mediaID: {
				type: "number",
			},
			mediaURL: {
				type: "string",
			},
			titleContent: {
				type: "string",
				selector: "h4",
			},
			subContent: {
				type: "string",
				selector: "p",
			},
		},

		// This means we will only see this block when the parent (perk-container) is present in the editor
		parent: ["blocks/perk-container/perk-container"],

		/**
		 * The edit function describes the structure of your block in the context of the editor.
		 * This represents what the editor will render when the block is used.
		 *
		 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
		 *
		 * @param {Object} [props] Properties passed from the editor.
		 *
		 * @return {WPElement} Element to render.
		 */
		edit: function (props) {
			var attributes = props.attributes;
			var titleContent = props.attributes.titleContent;
			var subContent = props.attributes.subContent;

			var onSelectImage = function (media) {
				return props.setAttributes({
					mediaURL: media.url,
					mediaID: media.id,
				});
			};

			return [
				el(
					InspectorControls,
					null,

					el(
						PanelBody,
						{
							title: "Perk Image Select",
						},

						el(
							"p",
							{ className: "components-base-control" },
							__("Choose an image to display with this perk", "perk")
						),
						el(
							"div",
							{ className: "components-base-control" },
							el(MediaUpload, {
								onSelect: onSelectImage,
								allowedTypes: "image",
								value: attributes.mediaID,
								render: function (obj) {
									return el(
										wp.components.Button,
										{
											className: "button button-large",
											onClick: obj.open,
										},
										!attributes.mediaID
											? __("Upload Image", "perk")
											: __("Change Image", "perk")
									);
								},
							})
						)
					)
				),

				el(
					"div",
					{ className: props.className },
					// Media Preview Area
					el(
						"div",
						{ className: "media-preview--area" },

						// Media Image Area
						el(
							"div",
							{ className: "media-image--area" },
							el(MediaUpload, {
								onSelect: onSelectImage,
								allowedTypes: "image",
								value: attributes.mediaID,
								render: function (obj) {
									return el(
										wp.components.Button,
										{
											className: !attributes.mediaID
												? "button button-large"
												: "button-image",
											onClick: obj.open,
										},
										!attributes.mediaID
											? __("Upload a new image", "perk")
											: el("img", { src: attributes.mediaURL })
									);
								},
							})
						),

						el(RichText, {
							tagName: "h4",
							inline: true,
							placeholder: __("You can enter a title here", "perk"),
							value: titleContent,
							onChange: function (value) {
								props.setAttributes({ titleContent: value });
							},
						}),

						el(RichText, {
							tagName: "p",
							inline: true,
							placeholder: __("You can enter a subline here", "perk"),
							value: subContent,
							onChange: function (value) {
								props.setAttributes({ subContent: value });
							},
						})
					)
				),
			];
		},

		/**
		 * The save function defines the way in which the different attributes should be combined
		 * into the final markup, which is then serialized by the block editor into `post_content`.
		 *
		 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
		 *
		 * @return {WPElement} Element to render.
		 */
		save: function () {
			// Return null because we want to user the render template
			return null;
		},
	});
})(window.wp);
