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

	var RichText = wp.blockEditor.RichText;
	var InnerBlocks = wp.blockEditor.InnerBlocks;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var RadioControl = wp.components.RadioControl;
	var PanelBody = wp.components.PanelBody;
	// Here we tell WP what blocks we want available in this block
	var allowedBlocks = ["create-block/perk", "create-block/cta-section"];

	/**
	 * Every block starts by registering a new block type definition.
	 *
	 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
	 */
	registerBlockType("create-block/perk-container", {
		/**
		 * This is the display title for your block, which can be translated with `i18n` functions.
		 * The block inserter will show this name.
		 */
		title: __("Perk Container", "perk-container"),

		/**
		 * This is a short description for your block, can be translated with `i18n` functions.
		 * It will be shown in the Block Tab in the Settings Sidebar.
		 */
		description: __(
			"A container block that holds multiple perk items.",
			"perk-container"
		),

		/**
		 * Blocks are grouped into categories to help users browse and discover them.
		 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
		 */
		category: "layout",

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

		// These attributes are used when rendering the content
		attributes: {
			titleContent: {
				type: "string",
				selector: "h2",
			},
			subContent: {
				type: "string",
				selector: "p",
			},
			marginSelect: {
				type: "string",
				default: "margins__none",
			},
		},

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
			var titleContent = props.attributes.titleContent;
			var subContent = props.attributes.subContent;
			var marginSelect = props.attributes.marginSelect;

			var onChangeMarginSelect = function (newValue) {
				props.setAttributes({ marginSelect: newValue });
			};

			return [
				el(
					InspectorControls,
					null,

					el(
						PanelBody,
						{
							title: "Margins",
						},

						el(RadioControl, {
							label: "Margins Select",
							selected: marginSelect,
							options: [
								{
									label: "No Margins",
									value: "margins__none",
								},
								{
									label: "Margins Top & Bottom",
									value: "margins__topBottom",
								},
								{
									label: "Top Margin Only",
									value: "margins__top",
								},
								{
									label: "Bottom Margin Only",
									value: "margins__bottom",
								},
							],
							onChange: onChangeMarginSelect,
						})
					)
				),

				el(
					"div",
					{ className: props.className },
					el(RichText, {
						tagName: "h2",
						inline: true,
						placeholder: __(
							"You can enter a title here, or not, it's not required",
							"perk-container"
						),
						value: titleContent,
						onChange: function (value) {
							props.setAttributes({ titleContent: value });
						},
					}),

					el(RichText, {
						tagName: "p",
						inline: true,
						placeholder: __(
							"You can enter a subline here, or not, it's not required",
							"perk-container"
						),
						value: subContent,
						onChange: function (value) {
							props.setAttributes({ subContent: value });
						},
					}),

					el(
						"div",
						{ className: "media-preview--area" },

						// Media Content Area
						el(
							"div",
							{ className: "media-content--area" },
							el(InnerBlocks, { allowedBlocks: allowedBlocks })
						)
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
		save: function (props) {
			// When returning InnerBlocks, only one instance of this can happen
			return el(InnerBlocks.Content, {});
		},
	});
})(window.wp);
