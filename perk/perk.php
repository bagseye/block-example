<?php
/**
 * Plugin Name:     Perk
 * Description:     An individual perk, that displays an image, title, and subtext.
 * Version:         0.1.0
 * Author:          Morgan Baker
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     perk
 *
 * @package         create-block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_perk_block_init() {
	$dir = get_template_directory() . '/blocks';

	$index_js = 'perk/index.js';
	wp_register_script(
		'create-block-perk-block-editor',
		get_template_directory_uri() . "/blocks/$index_js",
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-block-editor',
		),
		filemtime( "$dir/$index_js" )
	);
	wp_set_script_translations( 'create-block-perk-block-editor', 'perk' );

	$editor_css = 'perk/editor.css';
	wp_register_style(
		'create-block-perk-block-editor',
		get_template_directory_uri() . "/blocks/$editor_css",
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'perk/style.css';
	wp_register_style(
		'create-block-perk-block',
		get_template_directory_uri() . "/blocks/$style_css",
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'create-block/perk', array(
		'editor_script' 	=> 'create-block-perk-block-editor',
		'editor_style'  	=> 'create-block-perk-block-editor',
		'style'         	=> 'create-block-perk-block',
		'render_callback'	=> 'perk_block_render',
	) );
}
add_action( 'init', 'create_block_perk_block_init' );

function perk_block_render($attr, $content) {
	$str = '';

	if(isset($attr['mediaID'])) {
		$mediaID = $attr['mediaID'];

		$src = wp_get_attachment_image_src($mediaID, 'perk');

		if($src && is_array($src) && isset($src[0])) {
			$srcset = wp_get_attachment_image_srcset($mediaID);
			$sizes = wp_get_attachment_image_sizes($mediaID, 'perk');
			$alt = get_post_meta($mediaID, '_wp_attachment_image_alt', true);

			if(!$alt) {
				$alt = 'Perk icon';
			}
		}
	}

	if(isset($attr['titleContent'])) {
		$title = $attr['titleContent'];
	}

	if(isset($attr['subContent'])) {
		$subtitle = $attr['subContent'];
	}

	$str = "<div class='perks__item animate'>";
		if($mediaID) {
			$str .= "<img loading='lazy' width='170' height='170' src='{$src[0]}' alt='{$alt}'/>";
		}

		if($title) {
			$str .= "<h2>{$title}</h2>";
		}

		if($subtitle) {
			$str .= "<p>{$subtitle}</p>";
		}

	$str .= "</div>";

	return $str;
}
