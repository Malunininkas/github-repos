import { expect } from 'chai'
import * as sinon from 'sinon'
import applicationStore from '../application/store'
import * as ApiRepo from '../api/calls'
import { loadUserInfo } from './repos'

let sandbox

describe('repos', () => {

	const uid = 1

	describe('#loadContributorsCount', () => {

		beforeEach(() => sandbox = sinon.createSandbox())
		afterEach(() => sandbox.restore())

		it('should load and set contributors in the repo', async () => {

			const contributorsMock = {status: 200, body: [{ data: 1 }, { data: 2 }]}

			sandbox.stub(ApiRepo, 'getContributors').resolves(contributorsMock)
			sandbox.stub(ApiRepo, 'getStarredData').resolves()

			const store = applicationStore({
				repoReducer: {
					uids: [uid],
					byUid: {
						[uid]: {
							contributors: null
						}
					}
				}
			})
			await store.dispatch(loadUserInfo('testPath', uid))

			const repoItemState = store.getState().repoReducer.byUid[uid]

			expect(repoItemState.contributors).to.eq(contributorsMock.body.length)
		})

		it('should return no data if response is 204', async () => {

			const contributorsMock = {status: 204, body: [{ data: 1 }, { data: 2 }]}

			sandbox.stub(ApiRepo, 'getContributors').resolves(contributorsMock)
			sandbox.stub(ApiRepo, 'getStarredData').resolves()

			const store = applicationStore({
				repoReducer: {
					uids: [uid],
					byUid: {
						[uid]: {
							contributors: null
						}
					}
				}
			})
			await store.dispatch(loadUserInfo('testPath', uid))

			const repoItemState = store.getState().repoReducer.byUid[uid]

			expect(repoItemState.contributors).to.eq('No data')
		})

	})

	describe('#loadStarredInfo', () => {

		beforeEach(() => sandbox = sinon.createSandbox())
		afterEach(() => sandbox.restore())

		it('repo should be starred if response is successful', async () => {

			sandbox.stub(ApiRepo, 'getStarredData').resolves({ ok: true })
			sandbox.stub(ApiRepo, 'getContributors').resolves([])


			const store = applicationStore({
				repoReducer: {
					uids: [uid],
					byUid: {
						[uid]: {
							starred: false
						}
					}
				}
			})
			await store.dispatch(loadUserInfo('testPath', uid))

			const repoItemState = store.getState().repoReducer.byUid[uid]

			expect(repoItemState.starred).to.eq(true)

		})
	})
})
