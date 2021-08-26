import { createContext } from 'preact';
import { useEffect, useContext, useState, useRef } from 'preact/hooks';

class Container {
    subscribers = new Set();

    constructor(state) {
        this.state = state;
    }

    notify() {
        this.subscribers.forEach((sub) => sub());
    }
    sub(subscriber) {
        this.subscribers.add(subscriber);
    }
    unsub(subscriber) {
        this.subscribers.delete(subscriber);
    }
}

const Processor = ({
    onChange,
    store,
    args,
}) => {
    const result = store(...(args || []))
    useEffect(() => {
        onChange(result);
    });
    return null;
};

function getStoreContext (store, container) {
    if (store.context) { return store.context; }
    const context = createContext(container || new Container());
    store.context = context;
    return context;
}

function isEquals (v1, v2) {
    if (v1.length !== v2.length) { return false; }
    return v1.every((v, i) => v === v2[i]);
}


export function Provider ({
    store,
    children,
    args,
}) {
    const containerRef = useRef();
    if (!containerRef.current) {
        containerRef.current = new Container();
    }
    const container = containerRef.current;
    const Context = getStoreContext(store, container);
    const [isReady, setReady] = useState(false);
    const onChange = (v) => {
        if (!isReady) { setReady(true); }
        container.state = v;
        container.notify();
    }
    return <Context.Provider value={container}>
        <Processor
            onChange={onChange}
            store={store}
            args={args}
        />
        {isReady && children}
    </Context.Provider>;
}

export function useStore (store, deps) {
    const container = useContext(getStoreContext(store));
    const [state, setState] = useState(container.state);
    const depsRef = useRef([]);

    useEffect(() => {
        const sub = () => {
            if (!deps) {
                setState(container.state);
            } else {
                const oldDeps = depsRef.current;
                const newDeps = deps(container.state);
                if (newDeps.length && !isEquals(oldDeps, newDeps)) {
                    setState(container.state);
                }
                depsRef.current = newDeps;
            }
        }
        container.sub(sub);
        return () => container.unsub(sub);
    }, [])
    return state;
}

export function ComposedProvider ({
    stores,
    children,
}) {
    return stores.reverse().reduce((c, props) => {
        return <Provider {...props}>{c}</Provider>;
    }, children);
}