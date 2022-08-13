import {
    ApiException,
    FactorEnum,
    HttpMethod,
    ICity,
    IDefaults,
    ILoginCredentials,
    IPagination,
    IProject,
    ISignUpData,
    ITask,
    IUser,
    translit,
    Union
} from "./utils.types";

export class Api {
    private static readonly host: string = 'https://seobuster.ru/'

    private static async request<ReturnType>(
        path: string,
        method: HttpMethod = HttpMethod.Get,
        queryParams: any = {},
        bodyParams: any = {},
        pathParams: any = {},
    ): Promise<Union<ApiException, ReturnType>>
    {
        const url = this.host.endsWith('/')
                    ? this.host
                    : this.host + '/'

        let query = '?'

        for(const qp of Object.keys(queryParams))
            query += encodeURI(qp) + '=' + encodeURI(queryParams[qp] + '&')

        let pathString = path
        for(const pp of Object.keys(pathParams))
            pathString = pathString.replace(':' + pp, pathParams[pp])

        const body = JSON.stringify(bodyParams) === '{}' ? undefined : JSON.stringify(bodyParams)


        const result = await fetch(new URL(pathString + query, url).toString(), {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: 'include',
            body: body,
        })

        const text = await result.text()

        //console.log(text)

        const json = JSON.parse(text)

        return json as Union<ApiException, ReturnType>
    }

    public static async GetMe(): Promise<Union<IUser, ApiException>> {
        return await Api.request<IUser>("/api/users/me")
    }

    public static async Login(credentials: ILoginCredentials): Promise<Union<IUser, ApiException>> {
        return await Api.request<IUser>('/api/users/login', HttpMethod.Post, {}, credentials)
    }

    public static async SignUp(credentials: ISignUpData): Promise<Union<IUser, ApiException>> {
        return await Api.request<IUser>('/api/users/signup', HttpMethod.Post, {}, credentials)
    }

    public static async GetMyProjects(): Promise<Union<IProject[], ApiException>> {
        return await Api.request<IProject[]>('/api/projects/my')
    }

    public static async Logout(): Promise<Union<{}, ApiException>> {
        return await Api.request<{}>('/api/users/logout')
    }

    public static async GetCities(): Promise<Union<ICity[], ApiException>>{
        return await Api.request<ICity[]>('/api/cities')
    }

    public static async CreateProject(file: string, filePath: string, data: Partial<IProject>): Promise<Union<IProject, ApiException>>
    {
        return await Api.request<IProject>('/api/projects', HttpMethod.Post, {}, {
            fileToAdd: file,
            filePath: filePath,
            project: data
        })
    }

    public static async PatchMeTelegram(telegram: string): Promise<Union<IUser, ApiException>>
    {
        return await Api.request<IUser>('/api/users/me/telegram', HttpMethod.Patch, {}, {
            telegram: telegram
        })
    }

    public static async UploadFile(file: File): Promise<Union<{ uploadPath: string }, ApiException>>
    {
        const formData = new FormData()

        const name = translit(file.name.split('.')[0]) + '.xlsx'
        
        formData.append('file', file, name)


        const result = await fetch(Api.host + '/api/files/upload', {
            method: HttpMethod.Post,
            credentials: 'include',
            // @ts-ignore
            body: formData,
            mode: "cors"
        })

        const text = await result.text()

        const json = JSON.parse(text)

        return json as Union<ApiException, { uploadPath: string }>
    }

    public static async GetUserById(id: string): Promise<Union<IUser, ApiException>> {
        return await Api.request<IUser>('/api/users/:id', HttpMethod.Get, {}, {}, {
            id: id
        })
    }

    public static async GetUsers(): Promise<Union<IUser[], ApiException>>{
        return await Api.request<IUser[]>('/api/users')
    }

    public static async DeleteUser(id: string): Promise<Union<{}, ApiException>> {
        return await Api.request<{}>('/api/users/:id', HttpMethod.Delete, {}, {}, {
            id: id
        })
    }

    public static async DeleteProject(id: string): Promise<Union<{}, ApiException>> {
        return await Api.request<{}>('/api/projects/:id', HttpMethod.Delete, {}, {}, {
            id: id
        })
    }

    public static async UpdateUser(id: string, data: Partial<IUser>): Promise<Union<IUser, ApiException>> {
        return await Api.request<IUser>('/api/users/:id', HttpMethod.Put, {}, {
            user: data
        },
        {
            id: id
        })
    }

    public static async GetProjectById(id: string): Promise<Union<IProject, ApiException>> {
        return await Api.request<IProject>('/api/projects/:id', HttpMethod.Get, {}, {}, {
            id: id
        })
    }

    public static async CreateNewUser(userCredentials: ISignUpData): Promise<Union<IUser, ApiException>> {
        return await Api.request<IUser>('/api/users', HttpMethod.Post, {}, userCredentials)
    }

    public static async PatchProjectFactor(projectId: string, factor: FactorEnum): Promise<Union<IProject, ApiException>> {
        return await Api.request<IProject>('/api/projects/:id/factor', HttpMethod.Patch, {}, {
            factor: factor
        }, {
            id: projectId
        })
    }

    public static async AddTask(projectId: string, task: Partial<ITask>): Promise<Union<IProject, ApiException>> {
        return await Api.request<IProject>('/api/projects/:id/tasks', HttpMethod.Post, {}, {
            task: task
        }, {
            id: projectId
        })
    }

    public static async GetDefaults(): Promise<Union<IDefaults, ApiException>> {
        return await Api.request<IDefaults>('/api/defaults')
    }

    public static async SaveDefaults(defaults: IDefaults): Promise<Union<IDefaults, ApiException>> {
        return await Api.request<IDefaults>('/api/defaults', HttpMethod.Put, {}, {
            defaults: defaults
        })
    }

    public static async GetTasksPagination(page: number): Promise<Union<IPagination, ApiException>> {
        return await Api.request<IPagination>('/api/tasks', HttpMethod.Get,{
            page: page
        })
    }

    public static async GetTaskAndProjectById(id: string): Promise<Union<{ task: ITask, project: IProject }, ApiException>> {
        return await Api.request<{task: ITask, project: IProject}>('/api/tasks/:id', HttpMethod.Get, {}, {}, {
            id: id
        })
    }

    public static async DeductFromUserBalance(userId: string, sum: number){
        return await Api.request<{}>('/api/users/:id/deduct', HttpMethod.Get, {
            sum: sum
        }, {}, {
            id: userId
        })
    }

    public static async PutProject(projectId: string, data: Partial<IProject>){
        return await Api.request<IProject>('/api/projects/:id', HttpMethod.Put, {}, {
            project: data
        }, {
            id: projectId
        })
    }

    public static async PutTask(projectId: string, taskId: string, data: Partial<ITask>){
        return await Api.request<ITask>('/api/projects/:projectId/tasks/:taskId', HttpMethod.Put, {}, {
            task: data
        }, {
            projectId: projectId,
            taskId: taskId
        })
    }

    public static async RestoreTelegram(telegram: string){
        return await Api.request<{}>('/api/users/:telegram/restore', HttpMethod.Get, {}, {}, {
            telegram: telegram
        })
    }
}