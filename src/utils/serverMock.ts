export interface IServerResponse {
	status: number,
	data: string,
}

class ServerMock {
	private serverData: string = '[]';

	public saveRequest = (saveData: string): Promise<IServerResponse> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				this.serverData = saveData;
				const response: IServerResponse = {
					status: 200,
					data: null,
				};
				resolve(response);
			}, 200);
		})
	};

	public loadRequest = (): Promise<IServerResponse> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const response: IServerResponse = {
					status: 200,
					data: this.serverData,
				};
				resolve(response);
			}, 200);
		})
	};
}

export const serverMock = new ServerMock();
