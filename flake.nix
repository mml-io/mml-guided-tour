{
  description = "MML Guided Tour Development Flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        isAppleSilicon = system == flake-utils.lib.system.aarch64-darwin;
      in
      {
        devShells = {
          default = pkgs.mkShell {
            buildInputs =
              [
                pkgs.nodejs_20
                pkgs.google-cloud-sdk
              ]
              # node-canvas builds from source on Apple silicon,
              # so we need these additional deps
              ++ (nixpkgs.lib.lists.optionals isAppleSilicon [
                pkgs.pkg-config
                pkgs.pixman
                pkgs.cairo
                pkgs.pango
                pkgs.darwin.apple_sdk.frameworks.CoreText
              ]);
          };
        };
      }
    );
}
