declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 为移动端钱包连接添加类型声明
declare global {
    interface Window {
        Buffer: any;
        ethereum?: any;
        solana?: any;
    }
}