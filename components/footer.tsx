interface FooterProps {
  lang: string
  dict: any
}

export default function Footer({ lang, dict }: FooterProps) {
  // Component implementation using the passed dict prop
  // Remove any getDictionary calls from this component
  return (
    <footer>
      <p>{dict.footer.text}</p>
      <p>Language: {lang}</p>
    </footer>
  )
}
