/*
 *
 */

const canvas_opts = {
  width: '100%',
  height: '100%',
  horizontal_scroll: false,
  vertical_scroll: false,
  content_min_width: 'auto',
  parse_url_query_params: false,
  parse_url_options: false,
  toolbar_pos: 'top',
  use_toolbar: false,
  fullscreen_btn: false,
  hwr: false,
  feedback_btn: false,
  disable_ga_tracking: true,
  use_keyboard: false,
  use_hold_menu: false,
  toolbar_off_style: { 'display': 'none' },
  accept_dropped_assets: false,
  title_selector: false,
  log_mouse_trajectories: true,
  ask_confirmation_on_closing: false,
  identification_interval: false,
  demo_video_sources: [],
  demo_video_idle_time: false,
  show_welcome_tutorial: false,
  disable_notifications: true,
  active_tool: 'edit',
  custom_login_method: null,
  enable_google_classroom: false,
  enable_external_api: false,
  external_component_selectors: [],
  overflow_visible: true
};

const derivation_opts = {
  // canvas element options
  bg_rect_active_style: { fill: 'none', stroke: 'none' },
	bg_rect_hovering_style: { fill: 'none', stroke: 'none' },
  // derivation options
  font_size: 100,
  padding: { left: 5, right: 5, top: 5, bottom: 5 },
  v_align: 'center',
  h_align: 'equals',
  action_blacklist: [],
  dont_init_eq: false,
  pos: { x: 'center', y: 'center' },
  debug_lines: false,
  border_radius: 0,
  row_padding: { left: 0, right: 0, top: 0, bottom: 0 },
  edit_mode_drag_box_width: 0,
  row_border_color: '#ddd',
  row_background_color: 'white',
  collapsed_mode: true,
  draggable: false,
  no_history: false,
  no_handles: true,
  wiggle: [],
  cloning_on: false,
  modes: ['edit'],
  send_events: true,
  row_transition_dur: 0,
  resizable: { x: false, y: false },
  svg_no_overflow: false,
  show_area_hints: true,
  show_dest_hints: false,
  show_action_names: false,
  auto_trigger_actions: true,
  // algebra model options
  auto_simplify_distributions: true,
  auto_simplify_vector_additions: true,
  auto_simplify_multiplicative_annihilators: true,
  auto_simplify_multiplicative_identities: true,
  auto_simplify_additive_identities: true
};

jsPsych.plugins["gmlhlgm"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "gmlhlgm",
    parameters: {
      // This is an ascii representation of a math expression, which will be parsed by GM.
      expression: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      // Values: 'static', 'draw', 'dynamic'.
      condition: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'static'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    const trial_data = {};

    const d3_display_element = d3.select(display_element);

    const container = d3_display_element.append('div')
      .attr('id', 'gesture-trial-container');

    const div = container.append('div');

    const gm_container = div.append('div')
      .classed('gm-container', true)
      .style('position', 'relative');

    const canvas = new gmath.Canvas(gm_container.node(), canvas_opts);
    window.canvas = canvas;
    // FIXME: For some reason the svg within the canvas (deprecated, for the most part) has an altered position within the canvases on this page.
    // This is producing a horizontal scroll bar.  Removing SVGs here to prevent that.
    // div.select('.gm-canvas').selectAll('svg').remove();
    div.select('.gm-canvas').append('div')
      .style({ 
        'position': 'absolute',
        'width': '100%',
        'height': '100%' 
      })
      .classed('remove_me', true);

    derivation_opts.eq = trial.expression;

    const derivation = canvas.model.createDL(derivation_opts, function(d) {
      if (trial.condition == 'static') {
        // Still in edit mode.
        d.getLastView().interactive(false, false);
      }
      if (trial.condition == 'draw') {
        // Must do this after the creation of an element because the canvas
        // will switch mode to edit on creation.
        canvas.model.setActiveTool('draw');
      }
      // resize the expression when the font has loaded with the correct dimensions
      setupFontSizeInterval(d);
    });

    var startTime = Date.now();
    derivation.events.on('added_line.gmlhlgm', function(event) {
      console.log('added_line', event);
      if (event.action === 'GMLHLGMSquishAction') {
        trial_data.action1 = Date.now() - startTime;
        // console.log('1', trial_data.action1);
      }
      else if (event.action === 'GMLHLGMCrossEquals') {
        trial_data.action2 = Date.now() - startTime;
        // console.log('2', trial_data.action2);
      }
      else if (event.action === 'GMLHLGMPlaceholder') {
        trial_data.action3 = Date.now() - startTime;
        // console.log('3', trial_data);
        // end trial
        setTimeout(function() {
            jsPsych.finishTrial(trial_data);
        }, 3000);
      }
      else {
        console.log('unknown action');
      }
    });

    d3.selectAll('.remove_me').remove();
  };

  return plugin;
})();

function setupFontSizeInterval(derivation) {
  var wait = 0;
  var view = derivation.getLastView();
  var loadCount = 0;
  var gmFontInterval = setInterval(function checkFontSize() {
    wait += 100;
    if (view.wrongFontSize() && wait <= 5000) {
      view.loadSizes();
      loadCount++;
    }
    else {
      derivation.render();
      derivation.initPosition();
      clearInterval(gmFontInterval);
      console.log('attempted load', loadCount, 'times, total wait', wait, 'ms');
    }
  }, 100);
}