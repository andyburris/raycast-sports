export class Team {
    constructor(
        public id: string,
        public name: string,
        public shortName: string,
		public record: string | undefined,
        public iconUrl: string,
    ) {
    }
}