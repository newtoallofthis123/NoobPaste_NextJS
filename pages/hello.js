import React from 'react'
import Highlight from '@/components/editor'

export default function Hello() {
  return (
      <div>
          <Highlight language="javascript">
              {`const update_details = () => {
    // Update user details
}`}
            </Highlight>
    </div>
  )
}
