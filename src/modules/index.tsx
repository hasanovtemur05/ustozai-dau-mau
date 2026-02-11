import loadable from '@loadable/component'
import { Loading } from "../components"

const HomePage = loadable(()=> import ("./home/pages"),{
    fallback: <Loading/>
})

export { HomePage }