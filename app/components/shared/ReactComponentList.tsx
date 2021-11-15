import { Component } from 'vue-property-decorator';
import ReactComponent from './ReactComponent';

@Component({
  props: {
    name: { default: 'AdvancedAudio' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class AdvancedAudio extends ReactComponent {}

@Component({
  props: {
    name: { default: 'AdvancedStatistics' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class AdvancedStatistics extends ReactComponent {}

@Component({
  props: {
    name: { default: 'AppsNav' },
    wrapperStyles: {
      default: () => ({
        background: 'var(--section-alt)',
        position: 'relative',
        width: '52px',
        height: 0,
        paddingTop: '6px',
        flexGrow: 1,
        flexBasis: 0,
        overflow: 'hidden',
      }),
    },
  },
})
export class AppsNav extends ReactComponent {}

@Component({
  props: {
    name: { default: 'Chat' },
    componentProps: { default: () => ({ restream: false }) },
    wrapperStyles: {
      default: () => ({ height: '100%', display: 'flex', flexDirection: 'column' }),
    },
  },
})
export class Chat extends ReactComponent {}

@Component({
  props: {
    name: { default: 'Display' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
    componentProps: {
      default: () => ({
        paddingSize: 0,
        drawUI: false,
      }),
    },
  },
})
export class Display extends ReactComponent {}

@Component({
  props: {
    name: { default: 'EditStreamWindow' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class EditStreamWindow extends ReactComponent {}

@Component({
  props: {
    name: { default: 'GoLiveWindow' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class GoLiveWindow extends ReactComponent {}

@Component({
  props: {
    name: { default: 'Grow' },
    wrapperStyles: { default: () => ({ gridRow: '1 / span 1' }) },
  },
})
export class Grow extends ReactComponent {}

@Component({
  props: {
    name: { default: 'Highlighter' },
    componentProps: { default: () => ({}) },
  },
})
export class Highlighter extends ReactComponent {}

@Component({
  props: {
    name: { default: 'Loader' },
  },
})
export class Loader extends ReactComponent {}

@Component({
  props: {
    name: { default: 'IconLibraryProperties' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class IconLibraryProperties extends ReactComponent {}

@Component({
  props: {
    name: { default: 'NameFolder' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class NameFolder extends ReactComponent {}

@Component({
  props: {
    name: { default: 'NavTools' },
    wrapperStyles: { default: () => ({ marginTop: 'auto', flexShrink: 0 }) },
  },
})
export class NavTools extends ReactComponent {}

@Component({ props: { name: { default: 'NewsBanner' } } })
export class NewsBanner extends ReactComponent {}

@Component({ props: { name: { default: 'NotificationsArea' } } })
export class NotificationsArea extends ReactComponent {}

@Component({
  props: {
    name: { default: 'ObsSettings' },
    componentProps: { default: () => ({ page: 'General' }) },
  },
})
export class ObsSettings extends ReactComponent {}

@Component({ props: { name: { default: 'PatchNotes' } } })
export class PatchNotes extends ReactComponent {}

@Component({
  props: {
    name: { default: 'PerformanceMetrics' },
    componentProps: { default: () => ({ mode: 'limited' }) },
  },
})
export class PerformanceMetrics extends ReactComponent<{ mode: 'full' | 'limited' }> {}

@Component({
  props: {
    name: { default: 'PlatformLogo' },
    wrapperStyles: { default: () => ({}) },
  },
})
export class PlatformLogo extends ReactComponent<{
  platform: string;
  size?: 'medium' | number;
  color?: string;
  unwrapped?: boolean;
}> {}

@Component({
  props: {
    name: { default: 'RenameSource' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class RenameSource extends ReactComponent {}

@Component({
  props: {
    name: { default: 'SafeMode' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class SafeMode extends ReactComponent {}
@Component({
  props: {
    name: { default: 'ScreenCaptureProperties' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class ScreenCaptureProperties extends ReactComponent {}
@Component({
  props: {
    name: { default: 'SharedComponentsLibrary' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class SharedComponentsLibrary extends ReactComponent {}

@Component({ props: { name: { default: 'StartStreamingButton' } } })
export class StartStreamingButton extends ReactComponent {}

@Component({ props: { name: { default: 'StreamScheduler' } } })
export class StreamScheduler extends ReactComponent {}

@Component({ props: { name: { default: 'StudioEditor' } } })
export class StudioEditor extends ReactComponent {}

@Component({
  props: {
    name: { default: 'TestWidgets' },
    componentProps: { default: () => ({ testers: null as string[] }) },
  },
})
export class TestWidgets extends ReactComponent<{ testers: string[] }> {}

@Component({ props: { name: { default: 'ThemeAudit' } } })
export class ThemeAudit extends ReactComponent {}

@Component({
  props: {
    name: { default: 'TitleBar' },
    componentProps: { default: () => ({ windowId: '' }) },
  },
})
export class TitleBar extends ReactComponent {}

@Component({
  props: {
    name: { default: 'WidgetWindow' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class WidgetWindow extends ReactComponent {}

@Component({
  props: {
    name: { default: 'CustomCodeWindow' },
    wrapperStyles: { default: () => ({ height: '100%' }) },
  },
})
export class CustomCodeWindow extends ReactComponent {}
