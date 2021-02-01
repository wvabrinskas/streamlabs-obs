import Utils from 'services/utils';

// Ensures we only require native modules in windows we expect to
// need them in.
window['restrictedRequire'] = (module: string) => {
  const windowId = Utils.getWindowId();
  const allowLists = {
    'obs-studio-node': ['worker'],
  };
  console.log('RESTRICTED REQUIRE EXECUTED', module);

  const allowList = allowLists[module];

  if (!allowList) {
    throw new Error(`restrictedRequire tried to load module ${module} that wasn't registered`);
  }

  if (allowList.includes(windowId)) {
    console.log(`Allowing load of module ${module} in window ${module}`);
    return window['require'](module);
  } else {
    console.log(`Not allowing load of module ${module} in window ${module}`);
    return {};
  }
};

export default 'Restricted require loaded';
