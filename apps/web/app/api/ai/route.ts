// @ts-ignore
// @ts-nocheck

import { NextResponse } from 'next/server'
import PipelineSingleton from './pipeline'

const image_path = 'https://farm5.staticflickr.com/4007/4322154488_997e69e4cf_z.jpg'
export async function GET(request) {
	// const text = request.nextUrl.searchParams.get('text');
	// if (!text) {
	//   return NextResponse.json({
	//     error: 'Missing text parameter',
	//   }, { status: 400 });
	// }
	// Get the classification pipeline. When called for the first time,
	// this will load the pipeline and cache it for future use.
	const classifier = await PipelineSingleton.getInstance()

	// Actually perform the classification
	const result = await classifier(image_path)

	return NextResponse.json(result)
}
