
import { createRoot } from 'react-dom/client'
import Root from './routes/index'
import './index.css'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
const queryClient = new QueryClient({
  defaultOptions:{queries:{retry:4, retryDelay: 1000}}
})
createRoot(document.getElementById('root')!).render(
 
   <QueryClientProvider client={queryClient}>
     <Root />
   </QueryClientProvider>

)
