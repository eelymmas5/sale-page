<?php
// Additional WordPress configuration for GraphQL support

// Enable CORS for GraphQL requests
add_action('init', function() {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
        header('Access-Control-Allow-Credentials: true');
    }
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        }
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
            header('Access-Control-Allow-Headers: ' . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
        }
        
        exit(0);
    }
});

// Increase memory limit for GraphQL queries
ini_set('memory_limit', '512M');

// Enable WordPress debug logging in development
if (!defined('WP_DEBUG')) {
    define('WP_DEBUG', false);
}

if (!defined('WP_DEBUG_LOG')) {
    define('WP_DEBUG_LOG', false);
}

// Increase max execution time for complex GraphQL queries
ini_set('max_execution_time', 300);

// Custom post types for homepage content
function register_homepage_post_types() {
    // Register Features post type
    register_post_type('feature', array(
        'public' => true,
        'labels' => array(
            'name' => 'Features',
            'singular_name' => 'Feature'
        ),
        'supports' => array('title', 'editor', 'custom-fields'),
        'show_in_graphql' => true,
        'graphql_single_name' => 'feature',
        'graphql_plural_name' => 'features',
    ));
    
    // Register Testimonials post type
    register_post_type('testimonial', array(
        'public' => true,
        'labels' => array(
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial'
        ),
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'show_in_graphql' => true,
        'graphql_single_name' => 'testimonial',
        'graphql_plural_name' => 'testimonials',
    ));
}
add_action('init', 'register_homepage_post_types');

// Custom fields for Advanced Custom Fields (ACF) compatibility
function acf_graphql_field_groups() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group(array(
            'key' => 'group_homepage',
            'title' => 'Homepage Fields',
            'fields' => array(
                array(
                    'key' => 'field_hero_title',
                    'label' => 'Hero Title',
                    'name' => 'hero_title',
                    'type' => 'text',
                    'show_in_graphql' => 1,
                ),
                array(
                    'key' => 'field_hero_subtitle',
                    'label' => 'Hero Subtitle',
                    'name' => 'hero_subtitle',
                    'type' => 'textarea',
                    'show_in_graphql' => 1,
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'page_template',
                        'operator' => '==',
                        'value' => 'page-homepage.php',
                    ),
                ),
            ),
            'show_in_graphql' => 1,
            'graphql_field_name' => 'homepageFields',
        ));
    }
}
add_action('acf/init', 'acf_graphql_field_groups');
?>