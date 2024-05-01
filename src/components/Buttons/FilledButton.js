
export function FilledButton({type = 'default', children}){
    let cssClasses = 'bg-white  hover:border-2 hover:outline-4 hover:border-amber-300 hover:outline-white'
    if (type != 'default' ){
      cssClasses = type == 'filled' ? 'hover:text-stone-100 text-stone-100 bg-rs-green hover:border-indigo-500/50 border-2' : 'bg-indigo-500 hover:bg-slate-400/40 text-stone-100'}
    return (
        <button className={`py-1 px-4 rounded-md font-serif font-normal  text-sm tracking-[0.005em] ${cssClasses}`}>{children}</button>
    )
}