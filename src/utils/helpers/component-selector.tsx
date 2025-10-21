import { forwardRef } from "react";

function componentSelector<T, K>(components: any) {
    type Selector = K & {
        variation?: T;
        ref: any,
        locked?: boolean
    };
    
    const Data = forwardRef<any, Omit<Selector, "className">>((props, ref) => {
    const { variation } = props;

    const Component = variation && components[variation]
        ? components[variation]
        : components.default;

    if (!Component) {
        throw new Error(`Nenhuma variação encontrada e 'default' não foi definida.`);
    }

    return Component(props as K, ref);
    });


    return Data
}

export {
    componentSelector
}