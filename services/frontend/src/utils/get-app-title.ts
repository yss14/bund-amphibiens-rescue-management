export const getAppTitle = (): string => {
	return process.env.REACT_APP_APP_TITLE || 'React App';
}