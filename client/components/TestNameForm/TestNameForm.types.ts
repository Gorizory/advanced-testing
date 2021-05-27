export interface IProps {
    initialName: string;
    onChangeTestName: (name: string) => void;
}

export interface IState {
    currentName: string;
    changingName: boolean;
}
