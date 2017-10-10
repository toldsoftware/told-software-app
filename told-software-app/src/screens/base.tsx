import * as React from 'react';
import { NavigationScreenProp } from 'react-navigation';

export class ComponentBase<Props={}, State={}, NavState ={}> extends React.Component<Props & { navigation: NavigationScreenProp<NavState, {}> }, State>{

}
