interface HeaderProps {
  lang: string
  dict: any
}

export default function Header({ lang, dict }: HeaderProps) {
  // Component implementation using the passed dict prop
  // Remove any getDictionary calls from this component
  return (
    <header>
      <h1>{dict.title}</h1>
      <p>{dict.description}</p>
      <p>Language: {lang}</p>
    </header>
  )
}
