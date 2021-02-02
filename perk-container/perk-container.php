<?php
/**
 * Plugin Name:     Perk Container
 * Description:     A container block that holds multiple perk items.
 * Version:         0.1.0
 * Author:          Morgan Baker
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     perk-container
 *
 * @package         create-block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_perk_container_block_init() {
	$dir = get_template_directory() . '/blocks';

	$index_js = 'perk-container/index.js';
	wp_register_script(
		'create-block-perk-container-block-editor',
		get_template_directory_uri() . "/blocks/$index_js",
		// Here we load in the components we need
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-block-editor',
			'wp-components',
		),
		filemtime( "$dir/$index_js" )
	);
	wp_set_script_translations( 'create-block-perk-container-block-editor', 'perk-container' );

	$editor_css = 'perk-container/editor.css';
	wp_register_style(
		'create-block-perk-container-block-editor',
		get_template_directory_uri() . "/blocks/$editor_css",
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'perk-container/style.css';
	wp_register_style(
		'create-block-perk-container-block',
		get_template_directory_uri() . "/blocks/$style_css",
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'create-block/perk-container', array(
		'editor_script' 	=> 'create-block-perk-container-block-editor',
		'editor_style'  	=> 'create-block-perk-container-block-editor',
		'style'         	=> 'create-block-perk-container-block',
		'render_callback'	=> 'perk_container_block_render',
	) );
}
add_action( 'init', 'create_block_perk_container_block_init' );

function perk_container_block_render($attr, $content) {

	if(isset($attr['titleContent'])) {
		$titleContent = $attr['titleContent'];
	}

	if(isset($attr['subContent'])) {
		$subContent = $attr['subContent'];
	}

	if(isset($attr['marginSelect'])) {
		$marginVal = $attr['marginSelect'];
	} else {
		$marginVal = 'margins__none';
	}

	$str = '';

	$str = "<section class='perks width__full {$marginVal}'>";
		$str .= "<div class='perks__container'>";

			if($titleContent || $subContent) {
				$str .= "<div class='perks__title--container'>";
					if($titleContent) {
						$str .= "<h2>{$titleContent}</h2>";
					}

					if($subContent) {
						$str .= "<p class='is-style-lead'>{$subContent}</p>";
					}
				$str .= '</div>';
			}

			if($content) {
				$str .= '<div class="perks__layout">';
					$str .= $content;
				$str .= '</div>';
			}

		$str .= '</div>';
	$str .= '</section>';

	return $str;
}
