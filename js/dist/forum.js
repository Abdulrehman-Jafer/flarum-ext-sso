/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/forum/index.tsx"
/*!*****************************!*\
  !*** ./src/forum/index.tsx ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_HeaderSecondary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/HeaderSecondary */ "flarum/forum/components/HeaderSecondary");
/* harmony import */ var flarum_forum_components_HeaderSecondary__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_HeaderSecondary__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/LogInModal */ "flarum/forum/components/LogInModal");
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3__);




// @ts-ignore

/**
 * Returns a setting added by the extension
 */
function setting(slug, cast) {
  let setting = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute(`abdulrehman-sso.${slug}`);
  if (cast !== undefined) {
    if (cast === Boolean && !isNaN(setting)) {
      setting = Number(setting);
    }
    return cast(setting);
  }
  return setting;
}

/**
 * Returns login and signup props
 */
function getItems() {
  return {
    login: {
      url: setting('login_url'),
      itemName: 'logIn',
      removeItem: setting('remove_login_btn', Boolean),
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('core.forum.header.log_in_link')
    },
    signup: {
      url: setting('signup_url'),
      itemName: 'signUp',
      removeItem: setting('remove_signup_btn', Boolean),
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('core.forum.header.sign_up_link')
    }
  };
}
flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().initializers.add('abdulrehman-sso', () => {
  console.info('FORUM: App is initialized abdulrehman-sso!!!!!');
  // Lazily resolve LogInModal so it is available after all modules are registered
  // return
  const logInModalModule = (flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3___default());
  console.info("logInModalModule", logInModalModule);
  if (logInModalModule) {
    console.warn('abdulrehman-sso: LogInModalModule not found, skipping override.');
    if (!logInModalModule) {
      console.warn('abdulrehman-sso: logInModalModule not found, skipping override.');
    } else {
      (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.override)(logInModalModule.prototype, 'oncreate', () => {
        if (!setting('provider_mode', Boolean)) {
          const loginUrl = setting('login_url');
          if (loginUrl) {
            window.location.href = loginUrl;
          } else {
            flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show({
              type: 'error'
            }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('abdulrehman-sso.forum.no_login_url_error'));
          }
          throw new Error('Stop execution');
        }
      });
    } // end if LogInModal
  }
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__.extend)((flarum_forum_components_HeaderSecondary__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'items', buttons => {
    if (!setting('provider_mode', Boolean)) {
      const items = getItems();
      for (const [, props] of Object.entries(items)) {
        if (props.url) {
          if (props.removeItem) {
            buttons.remove(props.itemName);
          } else {
            // Remove login button
            if (!buttons.has(props.itemName)) {
              return;
            }
            buttons.setContent(props.itemName, m("a", {
              href: props.url,
              className: "Button Button--link"
            }, props.text));
          }
        }
      }
    }
  });

  // extend(SettingsPage.prototype, 'accountItems', (items) => {
  //   if (setting('provider_mode', Boolean) || !setting('login_url')) {
  //     return; // Do not add account items if no login url is set.
  //   }

  //   // Remove change email and password buttons
  //   items.remove('changeEmail');
  //   items.remove('changePassword');

  //   if (!setting('manage_account_url', Boolean)) {
  //     return;
  //   }

  //   items.add(
  //     'manageAccount',
  //     <a class="Button" href={setting('manage_account_url')} target={setting('manage_account_btn_open_in_new_tab', Boolean) ? '_blank' : ''}>
  //       {app.translator.trans('abdulrehman-sso.forum.manage_account_btn')}
  //     </a>
  //   );
  // });

  // extend(SettingsPage.prototype, 'settingsItems', (items) => {
  //   if (setting('manage_account_url', Boolean) || setting('provider_mode', Boolean)) {
  //     return; // Manage account link is added above
  //   }

  //   // Remove account section
  //   if (items.has('account') && items.get('account').children.length === 0) {
  //     items.remove('account');
  //   }
  // });
});

/***/ },

/***/ "flarum/common/extend"
/*!**********************************************************!*\
  !*** external "flarum.reg.get('core', 'common/extend')" ***!
  \**********************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/extend');

/***/ },

/***/ "flarum/forum/app"
/*!******************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/app')" ***!
  \******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/app');

/***/ },

/***/ "flarum/forum/components/HeaderSecondary"
/*!*****************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/HeaderSecondary')" ***!
  \*****************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/HeaderSecondary');

/***/ },

/***/ "flarum/forum/components/LogInModal"
/*!************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/LogInModal')" ***!
  \************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/LogInModal');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		flarum.reg._webpack_runtimes["abdulrehman-sso"] ||= __webpack_require__;// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.tsx");
// export * from './src/common';

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map